import express from "express";
import { integrationController } from "../interfaceAdapters/controllers/IntegrationController";

const integrationRouter = express.Router();

integrationRouter.post("/config", async (req, res) => {
  integrationController.configIntegrationHandler(req, res);
});

integrationRouter.post("/test", async (req, res) => {
  integrationController.testIntegrationHandler(req, res);
});

export default integrationRouter;
