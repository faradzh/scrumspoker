import { Request, Response } from "express";

import GetAllIssues from "../../useCases/GetAllIssues";
import ApiIssuePresenter from "../presenters/ApiIssuePresenter";
import InMemoryIntegrationRepository from "../repositories/InMemoryIntegrationRepository";
import RedisRoomRepository from "../repositories/RedisRoomRepository";
import IssueTransformer from "../presenters/JiraIssueTransformer";
import { redisRoomRepository } from "./constants";
import { inMemoryIntegrationRepository } from "./RoomController";

class IssueController<I> {
    private getAllIssuesUseCase;

    public constructor(
        private inMemoryIntegrationRepository: InMemoryIntegrationRepository,
        private redisRoomRepository: RedisRoomRepository,
        private apiIssuePresenter: ApiIssuePresenter,
        private issueTransformer: IssueTransformer
    ) {
        this.getAllIssuesUseCase = new GetAllIssues(inMemoryIntegrationRepository, redisRoomRepository, issueTransformer);
        this.apiIssuePresenter = apiIssuePresenter;
    }
    
    public async getIssuesHandler(req: Request, res: Response) {
        try {
            const roomId = req.query.roomId!.toString();
            const integration = await this.inMemoryIntegrationRepository.findIntegrationById(roomId);

            if (!integration) {
                throw new Error("Integration not found");
            }

            const issues = await this.getAllIssuesUseCase.execute(roomId);
            const response = issues.map((issue) => this.apiIssuePresenter.presentIssue(issue));
            
            res.status(200).json(response);
        } catch (error) {
            // @ts-ignore
            res.status(400).json({ message: error.message });
        }
    }
}

export const issueController = new IssueController(inMemoryIntegrationRepository, redisRoomRepository, new ApiIssuePresenter(), new IssueTransformer);

export default IssueController;