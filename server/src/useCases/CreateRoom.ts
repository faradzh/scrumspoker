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
  private userRepository;
  private testIntegration;

  constructor(
    roomRepository: RoomRepository,
    integrationRepository: IntegrationRepository,
    userRepository: any,
    testIntegration: TestIntegration
  ) {
    this.roomRepository = roomRepository;
    this.integrationRepository = integrationRepository;
    this.userRepository = userRepository;
    this.testIntegration = testIntegration;
  }

  public async execute(data: RoomData, user: RequestUser): Promise<any> {
    const roomId = uuidv4();
    const { integration } = data;

    const refreshToken = await this.userRepository.findRefreshToken?.(user);

    const integrationInstance = (await this.testIntegration.buildIntegration({
      ...integration,
      accessToken: user.accessToken,
      refreshToken,
    })) as JiraOauthIntegration;

    await this.testIntegration.updateResourceAttributes(
      user,
      integrationInstance
    );

    const integrationDoc = await this.integrationRepository.save(
      integrationInstance
    );

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
