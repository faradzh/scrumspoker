import RedisClient from "ioredis";

import { RoomRepository } from "./RoomRepository";
import Room from "../../entities/Room";
import { EstimationMethod, User } from "../../entities/types";
import { getSortedSetAsArrayOfObjects } from "./utils";
import { Estimation } from "../../types";

class RedisRoomRepository implements RoomRepository {
  private readonly client: RedisClient.Redis;

  constructor(client: RedisClient.Redis) {
    this.client = client;
  }

  async saveRoom(room: Room): Promise<Room> {
    const pipeline = this.client.pipeline();

    pipeline.hmset(`room:${room.id}`, {
      name: room.name,
      estimationMethod: room.estimationMethod,
      moderatorId: room.moderator?.id,
    });

    room.participants.forEach((participant) => {
      pipeline.sadd(`room:${room.id}:participants`, JSON.stringify(participant));
    });

    pipeline.set(`room:${room.id}:estimationIsRevealed`, "0");
    
    pipeline.exec();

    return room;
  }

  async findRoomById(id: string): Promise<Room | undefined> {
    const metadata = await this.client.hgetall(`room:${id}`);
    const participants = (await this.client.smembers(`room:${id}:participants`)).map((participant) => JSON.parse(participant));
    const estimates = await this.client.zrange(`room:${id}:estimation`, 0, -1, "WITHSCORES");
    const estimationIsRevealed = await this.client.get(`room:${id}:estimationIsRevealed`);

    // Room does not exist
    if (!metadata || !Object.keys(metadata).length) {
      return undefined;
    }
    
    const room = new Room(id, metadata.name, metadata.estimationMethod as EstimationMethod, participants, {id: metadata.moderatorId} as User, estimationIsRevealed === "1");
    
    if (estimates.length > 0) {
      for (const estimate of getSortedSetAsArrayOfObjects(estimates)){
        const userPicture = await this.client.hget(`room:${id}:user:${estimate.user.id}`, 'profilePicture');
        room.addEstimate({...estimate, user: {...estimate.user, picture: userPicture} as User});
      };
    }

    return room;
  }

  async joinRoom(room: Room, participant: User): Promise<Room| undefined> {
    let existingRoom = await this.findRoomById(room.id);
  
    if (!existingRoom) {
      existingRoom = await this.saveRoom(room);
    }

    this.client.sadd(`room:${room.id}:participants`, JSON.stringify(participant));

    return existingRoom;
  }

  async addEstimate(roomId: string, estimation: Estimation): Promise<void> {
    const timestamp = new Date();
    await this.client.zadd(`room:${roomId}:estimation`, estimation.value, estimation.user.id);
    await this.client.hset(`room:${roomId}:user:${estimation.user.id}`, 'profilePicture', estimation.user.picture ?? '');
  }

  async revealEstimation(roomId: string): Promise<void> {
    await this.client.set(`room:${roomId}:estimationIsRevealed`, "1");
  }
}

export default RedisRoomRepository