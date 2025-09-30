import express from "express";
const aiRoutes = express.Router();
import { getChatResponseFromModel, getAvailableModelsWithDetails } from "../controllers/ai.controller";

aiRoutes.post('/chat', getChatResponseFromModel);
aiRoutes.get('/getAvailableModelsWithDetails', getAvailableModelsWithDetails);

export { aiRoutes };