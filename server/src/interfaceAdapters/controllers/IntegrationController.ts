import { Request, Response } from "express";

import { IntegrationUseCase } from "../../types";
import { Integration as IntegrationI } from "../../entities/Integration";
import TestIntegration from "../../useCases/TestIntegration";

class IntegrationController {
  public constructor(private useCase: IntegrationUseCase) {
    this.useCase = useCase;
  }

  public async testIntegrationHandler(req: Request, res: Response) {
    try {
      const integrationRequestData = req.body as IntegrationI;
      const integration = this.useCase.buildTokenBasedIntegration({
        ...integrationRequestData,
        domainUrl: "https://bishkek.atlassian.net",
      });
      const response = await this.useCase.execute(integration);
      res.status(response.status).json({ message: response.statusText });
    } catch (error) {
      // @ts-ignore
      res.status(400).json({ message: error.message });
    }
  }
}

export const integrationController = new IntegrationController(
  new TestIntegration()
);

export default IntegrationController;
