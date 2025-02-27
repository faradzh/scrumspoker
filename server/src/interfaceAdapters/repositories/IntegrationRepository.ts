import { Integration } from "../../entities/Integration";

export interface IntegrationRepository {
    saveIntegration(data: Integration): Promise<Integration | void>;
    findIntegrationById(id: string): Promise<Integration | undefined>;
    deleteIntegration(id: string): Promise<void>;
    getAllIntegrations(): Promise<Integration[]>;
}