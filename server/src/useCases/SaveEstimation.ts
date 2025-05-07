import { Integration } from "../entities/Integration";
import MongoIntegrationRepository from "../interfaceAdapters/repositories/MongoIntegrationRepository";

class SaveEstimation {
  private integrationRepository: MongoIntegrationRepository;

  constructor(integrationRepository: MongoIntegrationRepository) {
    this.integrationRepository = integrationRepository;
  }

  private async saveEstimation(
    integration: any | undefined,
    issueId: string,
    value: number
  ): Promise<void> {
    if (!integration) {
      throw new Error("Integration not found");
    }

    const headers = {
      Authorization: integration.getAuthorizationHeader(),
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    await fetch(integration.getUpdateIssueUrl(issueId), {
      method: "PUT",
      headers,
      body: integration.getUpdateIssueBody(value),
    });
  }

  async execute(roomId: string, issueId: string, value: number): Promise<void> {
    const integrationDoc = await this.integrationRepository.findById(roomId);

    if (!integrationDoc) {
      throw new Error("Integration not found");
    }
    await this.saveEstimation(integrationDoc, issueId, value);
  }
}

export default SaveEstimation;
