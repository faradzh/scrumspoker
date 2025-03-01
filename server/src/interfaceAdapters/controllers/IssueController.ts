import { Request, Response } from "express";

import { IssueUseCase } from "../../types";
import InMemoryIntegrationRepository from "../repositories/InMemoryIntegrationRepository";
import GetAllIssues from "../../useCases/GetAllIssues";
import ApiIssuePresenter from "../presenters/ApiIssuePresenter";
import { redisRoomRepository } from "./constants";

class IssueController {
    public constructor(private useCase: IssueUseCase, private issuePresenter: ApiIssuePresenter) {
        this.useCase = useCase;
        this.issuePresenter = issuePresenter;
    }
    
    public async getIssuesHandler(req: Request, res: Response) {
        try {
            const roomId = req.params.id;

            const issues = await (this.useCase as GetAllIssues).execute(roomId);
            const response = issues.map((issue) => this.issuePresenter.presentIssue(issue));
            
            res.status(200).json(response);
        } catch (error) {
            // @ts-ignore
            res.status(400).json({ message: error.message });
        }
    }
}

export const issueController = new IssueController(new GetAllIssues(new InMemoryIntegrationRepository(), redisRoomRepository), new ApiIssuePresenter());

export default IssueController;