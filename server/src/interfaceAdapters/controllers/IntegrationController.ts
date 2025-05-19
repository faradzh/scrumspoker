import { Request, Response } from "express";

import { IntegrationRequestData, IntegrationUseCase } from "../../types";
import { RequestUser } from "../../infrastructure/auth/types";
import { testIntegrationUseCase } from "./constants";

class IntegrationController {
  public constructor(private useCase: IntegrationUseCase) {
    this.useCase = useCase;
  }

  public async testIntegrationHandler(req: Request, res: Response) {
    const user = req.user as RequestUser;
    try {
      const { issues } = await this.useCase.execute(req.body, user);

      res.status(200).json({ issues: { total: issues.length } });
    } catch (error) {
      // @ts-ignore
      res.status(400).json({ message: error.message });
    }
  }
}

export const integrationController = new IntegrationController(
  testIntegrationUseCase
);

export default IntegrationController;
