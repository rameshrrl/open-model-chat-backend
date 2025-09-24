import express from "express";
const aiRoutes = express.Router();
import { getChatResponseFromModel } from "../controllers/ai.controller";

aiRoutes.post('/chat', getChatResponseFromModel);

export { aiRoutes };