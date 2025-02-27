import { Request, Response } from "express";

import { IntegrationUseCase } from "../../types";
import AddIntegration from "../../useCases/AddIntegration";
import InMemoryIntegrationRepository from "../repositories/InMemoryIntegrationRepository";
import { IntegrationTypeEnum } from "../../useCases/constants";

const email = "faradj.musaev@gmail.com";
const apiToken = process.env.JIRA_API_TOKEN!;

class IntegrationController {
    public constructor(private useCase: IntegrationUseCase) {
        this.useCase = useCase;
    }
    
    public async addIntegrationHandler(req: Request, res: Response) {
        try {
            // const integrationRequestData = req.body;

            // @ts-ignore until request type is defined
            await (this.useCase as AddIntegration).execute({id: IntegrationTypeEnum.JIRA, email, apiToken});
            res.status(201).json({ message: 'Integration added successfully' });
        } catch (error) {
            // @ts-ignore
            res.status(400).json({ message: error.message });
        }
    }
}

export const integrationController = new IntegrationController(new AddIntegration(new InMemoryIntegrationRepository()));

export default IntegrationController;