import { Request, Response } from "express";

import { IntegrationUseCase } from "../../types";
import AddIntegration from "../../useCases/AddIntegration";
import InMemoryIntegrationRepository from "../repositories/InMemoryIntegrationRepository";
import ApiIntegrationPresenter from "../presenters/ApiIntegrationPresenter";

class IntegrationController {
    public constructor(private useCase: IntegrationUseCase, private integrationPresenter: ApiIntegrationPresenter) {
        this.useCase = useCase;
        this.integrationPresenter = integrationPresenter;
    }
    
    public async addIntegrationHandler(req: Request, res: Response) {
        try {
            const integrationRequestData = req.body;

            const integration = await (this.useCase as AddIntegration).execute(integrationRequestData);
            const response = this.integrationPresenter.presentIntegration(integration);
            res.status(201).json({ message: 'Integration added successfully', data: response });
        } catch (error) {
            // @ts-ignore
            res.status(400).json({ message: error.message });
        }
    }
}

export const integrationController = new IntegrationController(new AddIntegration(new InMemoryIntegrationRepository()), new ApiIntegrationPresenter());

export default IntegrationController;