import { Request, Response } from "express";

import ApiIssuePresenter from "../presenters/ApiIssuePresenter";
import {
  getAllIssues,
  mongoIntegrationRepository,
  mongoRoomRepository,
  redisRoomRepository,
} from "./constants";
import SaveEstimation from "../../useCases/SaveEstimation";
import { RequestUser } from "../../infrastructure/auth/types";

class IssueController<I> {
  private getAllIssues;
  private saveEstimation;

  public constructor(private apiIssuePresenter: ApiIssuePresenter) {
    this.getAllIssues = getAllIssues;
    this.saveEstimation = new SaveEstimation(
      mongoIntegrationRepository,
      redisRoomRepository,
      mongoRoomRepository
    );
    this.apiIssuePresenter = apiIssuePresenter;
  }

  public async getIssuesHandler(req: Request, res: Response) {
    try {
      const roomId = req.query.roomId!.toString();
      const user = req.user as RequestUser;

      const issues = await this.getAllIssues.execute(roomId, user);
      const list = issues.data.map((issue) =>
        this.apiIssuePresenter.presentIssue(issue)
      );

      const response = {
        data: list,
        domainUrl: issues.domainUrl,
        currentIssue: issues.currentIssue,
      };

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
      const user = req.user as RequestUser;

      await this.saveEstimation.execute(roomId, issueId, estimationValue, user);

      res.status(200).json({ message: "Estimation saved" });
    } catch (error) {
      // @ts-ignore
      res.status(400).json({ message: error.message });
    }
  }
}

export const issueController = new IssueController(new ApiIssuePresenter());

export default IssueController;
