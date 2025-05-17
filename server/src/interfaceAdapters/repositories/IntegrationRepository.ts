import { Integration } from "../../entities/Integration";
import { IntegrationDocument } from "../../infrastructure/database/mongodb/schemas/IntegrationSchema";

export interface IntegrationRepository {
  save(data: any): Promise<IntegrationDocument>;
  findById(id: string): Promise<IntegrationDocument | null>;
  update(data: any): Promise<IntegrationDocument | null>;
  delete(id: string): Promise<void>;
}
