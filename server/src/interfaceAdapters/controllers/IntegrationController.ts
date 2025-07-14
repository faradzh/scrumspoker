import { Request, Response } from "express";

import { RequestUser } from "../../infrastructure/auth/types";
import { configIntegrationUseCase, testIntegrationUseCase } from "./constants";
import TestIntegration from "../../useCases/TestIntegration";
import ConfigIntegration from "../../useCases/ConfigIntegration";

class IntegrationController {
  public constructor(
    private testIntegration: TestIntegration,
    private configItegration: ConfigIntegration
  ) {
    this.testIntegration = testIntegration;
    this.configItegration = configItegration;
  }

  public async testIntegrationHandler(req: Request, res: Response) {
    const user = req.user as RequestUser;
    try {
      const { issues } = await this.testIntegration.execute(req.body, user);

      res.status(200).json({ issues: { total: issues.length } });
    } catch (error) {
      // @ts-ignore
      res.status(400).json({ message: error.message });
    }
  }

  public async configIntegrationHandler(req: Request, res: Response) {
    const user = req.user as RequestUser;
    try {
      const config = await this.configItegration.execute(req.body, user);

      res.status(200).json({ ...config });
    } catch (error) {
      // @ts-ignore
      res.status(400).json({ message: error.message });
    }
  }
}

export const integrationController = new IntegrationController(
  testIntegrationUseCase,
  configIntegrationUseCase
);

export default IntegrationController;
