import { Integration } from "../../entities/Integration";

export interface IntegrationRepository {
  saveIntegration(roomId: string, data: any): Promise<Integration | void>;
  findIntegrationById(id: string): Promise<Integration | undefined>;
  deleteIntegration(id: string): Promise<void>;
}
