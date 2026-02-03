import express, { Request } from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
const aiRoutes = express.Router();
import { getChatResponseFromModel, getAvailableModelsWithDetails, getChatResponseFromModelUsingStream, getVisionResponseFromModelUsingStream } from "../controllers/ai.controller";

const uploadsDir = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) =>
    cb(null, uploadsDir),
  filename: (_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}_${safeName}`);
  },
});

const upload = multer({ storage });

aiRoutes.post('/chat', getChatResponseFromModel);
aiRoutes.post('/stream', getChatResponseFromModelUsingStream);
aiRoutes.post('/vision', upload.single('image'), getVisionResponseFromModelUsingStream);
aiRoutes.get('/getAvailableModelsWithDetails', getAvailableModelsWithDetails);

export { aiRoutes };
