import express from "express";

import { issueController } from "../interfaceAdapters/controllers/IssueController";

const issuesRouter = express.Router();

issuesRouter.get("/", async (req, res) => {
  issueController.getIssuesHandler(req, res);
});

issuesRouter.put("/:issueId", async (req, res) => {
  issueController.updateIssueHandler(req, res);
});

export default issuesRouter;
