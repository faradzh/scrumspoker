import Redis from "ioredis";

import { RoomRepository } from "./RoomRepository";
import Room from "../../entities/Room";
import { Estimates, EstimationMethod, Issue, User } from "../../entities/types";
import { Estimation } from "../../types";

class RedisRoomRepository implements RoomRepository {
  private readonly client: Redis;

  constructor(client: Redis) {
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
      this.saveParticipant(room.id, participant);
    });

    pipeline.exec();
  }

  async saveParticipant(roomId: string, participant: User): Promise<void> {
    await this.client.rpush(
      `room:${roomId}:participants`,
      JSON.stringify(participant)
    );
    await this.setParticipantOnline(roomId, participant, true);
  }

  async setParticipantOnline(
    roomId: string,
    participant: User,
    online: boolean
  ): Promise<void> {
    await this.client.set(
      `room:${roomId}:participant:${participant.id}:online`,
      String(online)
    );
  }

  async augmentParticipantsStatus(roomId: string, participants: string[]) {
    const updatedParticipants = [];

    for (let p of participants) {
      const current = JSON.parse(p);
      const online = await this.client.get(
        `room:${roomId}:participant:${current.id}:online`
      );
      updatedParticipants.push({ ...current, online: online === "true" });
    }

    return updatedParticipants;
  }

  async retrieveEstimates(roomId: string): Promise<Estimates> {
    const estimates: Estimates = {};

    const keys = await this.client.keys(`estimations:${roomId}:*`);

    for (const key of keys) {
      const issueEstimates = await this.client.hgetall(key);
      const issueId = key.split(":")[2] as string;
      estimates[issueId] = issueEstimates;
    }

    return estimates;
  }

  async findRoomById(id: string): Promise<Room | undefined> {
    const metadata = await this.client.hgetall(`room:${id}`);
    const participantsWithNoStatus = await this.client.lrange(
      `room:${id}:participants`,
      0,
      -1
    );

    const participants = await this.augmentParticipantsStatus(
      id,
      participantsWithNoStatus
    );

    const estimates = await this.retrieveEstimates(id);

    const revealedIssues = await this.client.smembers(
      `room:${id}:revealedIssues`
    );

    const estimatedIssues = await this.client.smembers(
      `room:${id}:estimatedIssues`
    );

    const totalEstimationPerIssue = await this.client.hgetall(
      `totalEstimationPerIssue:${id}`
    );

    const currentIssue = await this.client.get(`room:${id}:currentIssue`);

    // Room does not exist
    if (!metadata || !Object.keys(metadata).length) {
      return undefined;
    }

    const room = new Room(
      id,
      metadata.name,
      metadata.estimationMethod as EstimationMethod,
      participants,
      [],
      [],
      currentIssue,
      { id: metadata.moderatorId } as User
    );

    room.estimates = estimates;
    room.totalEstimationPerIssue = totalEstimationPerIssue;

    if (revealedIssues.length) {
      revealedIssues?.forEach((issueId) => {
        room.setRevealedIssue(issueId);
      });
    }

    if (estimatedIssues.length) {
      estimatedIssues?.forEach((issueId) => {
        room.setEstimatedIssue(issueId);
      });
    }

    return room;
  }

  async joinRoom(room: Room): Promise<Room> {
    const existingRoom = await this.findRoomById(room.id);

    if (!existingRoom) {
      await this.saveRoom(room);
      return (await this.findRoomById(room.id)) as Room;
    }

    return existingRoom;
  }

  async addEstimateByIssue(
    roomId: string,
    estimation: Estimation
  ): Promise<void> {
    await this.client.hset(
      `estimations:${roomId}:${estimation.issueId}`,
      estimation.userId,
      estimation.value
    );
  }

  async removeEstimationByIssue(
    roomId: string,
    estimation: Estimation
  ): Promise<void> {
    await this.client.del(`estimations:${roomId}:${estimation.issueId}`);
  }

  async revealEstimation(roomId: string, issueId: string): Promise<void> {
    await this.client.sadd(`room:${roomId}:revealedIssues`, issueId);
  }

  async hideEstimation(roomId: string, issueId: string): Promise<void> {
    await this.client.srem(`room:${roomId}:revealedIssues`, issueId);
  }

  async addEstimatedIssue(roomId: string, issueId: string): Promise<void> {
    await this.client.sadd(`room:${roomId}:estimatedIssues`, issueId);
  }

  async removeEstimatedIssue(roomId: string, issueId: string): Promise<void> {
    await this.client.srem(`room:${roomId}:estimatedIssues`, issueId);
  }

  async addIssueTotalEstimation(
    roomId: string,
    issueId: string,
    value: number
  ): Promise<void> {
    await this.client.hset(`totalEstimationPerIssue:${roomId}`, issueId, value);
  }

  async removeIssueTotalEstimation(
    roomId: string,
    issueId: string
  ): Promise<void> {
    await this.client.hdel(`totalEstimationPerIssue:${roomId}`, issueId);
  }

  async setCurrentIssue(roomId: string, issueId: string): Promise<void> {
    await this.client.set(`room:${roomId}:currentIssue`, issueId);
  }

  async getCurrentIssue(roomId: string): Promise<string | null> {
    return await this.client.get(`room:${roomId}:currentIssue`);
  }

  async saveIntegrationIssues(roomId: string, issues: Issue[]): Promise<void> {
    for (const issue of issues) {
      await this.client.rpush(
        `room:${roomId}:integrationIssues`,
        JSON.stringify(issue)
      );
    }
  }

  async findIntegrationIssues(roomId: string): Promise<Issue[]> {
    const issues = await this.client.lrange(
      `room:${roomId}:integrationIssues`,
      0,
      -1
    );

    return issues.map((issue) => JSON.parse(issue));
  }

  async findIntegrationIssue(
    roomId: string,
    issueId: string
  ): Promise<Issue | undefined> {
    const issues = await this.findIntegrationIssues(roomId);

    return issues.find((issue) => issue.id === issueId);
  }

  async deleteRoom(id: string): Promise<void> {
    const pipeline = this.client.pipeline();

    pipeline.del(`room:${id}`);
    pipeline.del(`room:${id}:participants`);
    pipeline.del(`room:${id}:revealedIssues`);
    pipeline.del(`room:${id}:estimatedIssues`);
    pipeline.del(`totalEstimationPerIssue:${id}`);
    pipeline.del(`room:${id}:currentIssue`);
    pipeline.del(`estimations:${id}:*`);
    pipeline.del(`room:${id}:integrationIssues`);

    // Delete all online participants
    const participantKeys = await this.client.keys(
      `room:${id}:participant:*:online`
    );
    if (participantKeys.length > 0) {
      await pipeline.del(...participantKeys);
    }

    // Delete all estimations for the room
    const estimationKeys = await this.client.keys(`estimations:${id}:*`);
    if (estimationKeys.length > 0) {
      await this.client.del(...estimationKeys);
    }

    await pipeline.exec();
  }
}

export default RedisRoomRepository;
