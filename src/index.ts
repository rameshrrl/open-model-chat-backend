import express from 'express';
import cors from 'cors';
import { askGemma } from './ollama';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/chat', async (req: express.Request, res: express.Response) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }
  const response = await askGemma(message);
  res.json({ response });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
