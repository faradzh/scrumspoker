import express from "express";

import { issueController } from "../interfaceAdapters/controllers/IssueController";

const issuesRouter = express.Router();

issuesRouter.get("/", async (req, res) => {
    issueController.getIssuesHandler(req, res);
});

export default issuesRouter;