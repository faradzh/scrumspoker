import { Request, Response } from "express";

import GetAllIssues from "../../useCases/GetAllIssues";
import ApiIssuePresenter from "../presenters/ApiIssuePresenter";
import { redisRoomRepository } from "./constants";
import { inMemoryIntegrationRepository } from "./RoomController";
import SaveEstimation from "../../useCases/SaveEstimation";

class IssueController<I> {
  private getAllIssuesUseCase;
  private saveEstimationUseCase;

  public constructor(private apiIssuePresenter: ApiIssuePresenter) {
    this.getAllIssuesUseCase = new GetAllIssues(
      inMemoryIntegrationRepository,
      redisRoomRepository
    );
    this.saveEstimationUseCase = new SaveEstimation(
      inMemoryIntegrationRepository
    );
    this.apiIssuePresenter = apiIssuePresenter;
  }

  public async getIssuesHandler(req: Request, res: Response) {
    try {
      const roomId = req.query.roomId!.toString();

      const issues = await this.getAllIssuesUseCase.execute(roomId);
      const response = issues.map((issue) =>
        this.apiIssuePresenter.presentIssue(issue)
      );

      res.status(200).json(response);
    } catch (error) {
      // @ts-ignore
      res.status(400).json({ message: error.message });
    }
  }

  public async updateIssueHandler(req: Request, res: Response) {
    try {
      const roomId = req.query.roomId!.toString();
      const issueId = req.params.issueId;
      const estimationValue = req.body.value;

      await this.saveEstimationUseCase.execute(
        roomId,
        issueId,
        estimationValue
      );

      res.status(200).json({ message: "Estimation saved" });
    } catch (error) {
      // @ts-ignore
      res.status(400).json({ message: error.message });
    }
  }
}

export const issueController = new IssueController(new ApiIssuePresenter());

export default IssueController;
