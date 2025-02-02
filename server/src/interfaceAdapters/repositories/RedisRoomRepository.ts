import RedisClient from "ioredis";

import { RoomRepository } from "./RoomRepository";
import Room from "../../entities/Room";

class RedisRoomRepository implements RoomRepository {
  private readonly client: RedisClient.Redis;

  constructor(client: RedisClient.Redis) {
    this.client = client;
  }

  async saveRoom(room: Room): Promise<void> {
    const pipeline = this.client.pipeline();

    pipeline.hmset(`room:${room.id}`, {
      name: room.name,
      estimationMethod: room.estimationMethod,
      moderatorId: room.moderator?.id,
    });

    room.participants.forEach((participant) => {
      pipeline.sadd(`room:${room.id}:participants`, participant.id);
    });
    
    // pipeline.rpush(`room:${room.id}:estimates`, JSON.stringify(estimate));

    pipeline.exec();
  }

  async findRoomById(id: string): Promise<Room | undefined> {
    const metadata = await this.client.hgetall(`room:${id}`);

      // Room does not exist
      if (!metadata || !Object.keys(metadata).length) {
        return undefined;
      }
    
      return {
        id,
        name: metadata.name,
      } as Room;
  }

  async joinRoom(room: Room): Promise<void> {
    const existingRoom = await this.findRoomById(room.id);

    if (!existingRoom) {
      this.saveRoom(room);
    }

    room.participants.forEach((participant) => {
      this.client.sadd(`room:${room.id}:participants`, participant.id);
    });
  }
}

export default RedisRoomRepository