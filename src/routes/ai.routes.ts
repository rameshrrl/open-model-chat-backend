import express from "express";
const aiRoutes = express.Router();
import { getChatResponseFromModel, getAvailableModelsWithDetails, getChatResponseFromModelUsingStream } from "../controllers/ai.controller";

aiRoutes.post('/chat', getChatResponseFromModel);
aiRoutes.get('/stream', getChatResponseFromModelUsingStream);
aiRoutes.get('/getAvailableModelsWithDetails', getAvailableModelsWithDetails);

export { aiRoutes };