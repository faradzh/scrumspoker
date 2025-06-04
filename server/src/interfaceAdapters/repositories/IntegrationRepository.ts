import { Integration } from "../../entities/Integration";
import { IntegrationDocument } from "../../infrastructure/database/mongodb/schemas/IntegrationSchema";
import { OAUTH2INTEGRATION_CLASSES } from "../../useCases/constants";

export interface IntegrationRepository {
  save(data: Integration): Promise<IntegrationDocument>;
  findById(
    id: string
  ): Promise<
    InstanceType<
      (typeof OAUTH2INTEGRATION_CLASSES)[keyof typeof OAUTH2INTEGRATION_CLASSES]
    >
  >;
  update(data: any): Promise<IntegrationDocument | null>;
  delete(id: string): Promise<void>;
}
