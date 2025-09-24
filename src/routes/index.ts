import express from 'express';
const applicationRouter = express.Router();
import { aiRoutes } from "./ai.routes";

applicationRouter.use('/ai', aiRoutes);

export { applicationRouter };