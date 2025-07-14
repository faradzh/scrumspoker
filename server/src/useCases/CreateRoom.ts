import { v4 as uuidv4 } from "uuid";

import Room from "../entities/Room";
import { RoomRepository } from "../interfaceAdapters/repositories/RoomRepository";
import { RoomData } from "../types";
import { RequestUser } from "../infrastructure/auth/types";
import { IntegrationRepository } from "../interfaceAdapters/repositories/IntegrationRepository";
import TestIntegration from "./TestIntegration";
import JiraOauthIntegration from "../entities/JiraOauthIntegration";

class CreateRoom {
  private roomRepository;
  private integrationRepository;
  private testIntegration;

  constructor(
    roomRepository: RoomRepository,
    integrationRepository: IntegrationRepository,
    testIntegration: TestIntegration
  ) {
    this.roomRepository = roomRepository;
    this.integrationRepository = integrationRepository;
    this.testIntegration = testIntegration;
  }

  public async execute(data: RoomData, user: RequestUser): Promise<any> {
    const roomId = uuidv4();

    const integration = (await this.testIntegration.buildIntegration({
      ...data.integration,
      accessToken: user.accessToken,
    })) as JiraOauthIntegration;

    const integrationDoc = await this.integrationRepository.save(integration);

    const newRoom = this.createRoomInstance(roomId, {
      ...data,
      moderator: user.profile,
    });

    await this.roomRepository.saveRoom?.({
      id: roomId,
      name: data.name,
      estimationMethod: data.estimationMethod,
      moderator: user.profile,
      integration: integrationDoc._id,
    });

    return newRoom;
  }

  private createRoomInstance(roomId: string, data: RoomData): Room {
    return new Room(
      roomId,
      data.name,
      data.estimationMethod,
      [],
      [],
      [],
      null,
      {
        ...data.moderator,
        online: true,
      }
    );
  }
}

export default CreateRoom;
