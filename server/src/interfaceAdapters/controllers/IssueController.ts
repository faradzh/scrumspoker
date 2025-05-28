import { Request, Response } from "express";

import ApiIssuePresenter from "../presenters/ApiIssuePresenter";
import {
  getAllIssues,
  mongoIntegrationRepository,
  redisRoomRepository,
} from "./constants";
import SaveEstimation from "../../useCases/SaveEstimation";

class IssueController<I> {
  private getAllIssues;
  private saveEstimation;

  public constructor(private apiIssuePresenter: ApiIssuePresenter) {
    this.getAllIssues = getAllIssues;
    this.saveEstimation = new SaveEstimation(
      mongoIntegrationRepository,
      redisRoomRepository
    );
    this.apiIssuePresenter = apiIssuePresenter;
  }

  public async getIssuesHandler(req: Request, res: Response) {
    try {
      const roomId = req.query.roomId!.toString();

      const issues = await this.getAllIssues.execute(roomId);
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

      await this.saveEstimation.execute(roomId, issueId, estimationValue);

      res.status(200).json({ message: "Estimation saved" });
    } catch (error) {
      // @ts-ignore
      res.status(400).json({ message: error.message });
    }
  }
}

export const issueController = new IssueController(new ApiIssuePresenter());

export default IssueController;
