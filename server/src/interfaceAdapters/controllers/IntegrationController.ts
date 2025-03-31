import { Request, Response } from "express";

import { IntegrationUseCase } from "../../types";
import { Integration as IntegrationI } from "../../entities/Integration";
import Integration from "../../useCases/Integration";
import { inMemoryIntegrationRepository } from "./RoomController";

class IntegrationController {
  public constructor(private useCase: IntegrationUseCase) {
    this.useCase = useCase;
  }

  public async testIntegrationHandler(req: Request, res: Response) {
    try {
      const integrationRequestData = req.body as IntegrationI;
      const integration = this.useCase.buildTokenBasedIntegration(
        integrationRequestData
      );
      const response = await this.useCase.testIntegration(integration);
      res.status(response.status).json({ message: response.statusText });
    } catch (error) {
      // @ts-ignore
      res.status(400).json({ message: error.message });
    }
  }
}

export const integrationController = new IntegrationController(
  new Integration(inMemoryIntegrationRepository)
);

export default IntegrationController;
