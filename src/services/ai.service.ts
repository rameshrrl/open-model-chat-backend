import ollama from 'ollama';
import { generateResponse } from '../helpers/response';
import fs from 'fs/promises';

export async function getResponseFromModel(prompt: string): Promise<string> {
  try {
    const response = await ollama.chat({
      model: 'gemma3:4b',
      messages: [{ role: 'user', content: prompt }]
    });
    return response.message.content;
  } catch (error: any) {
    return `Error: ${error.message}`;
  }
}

export async function getAvailableModels(): Promise<any> {
  try {
    const models = await ollama.list();
    const modelsList = Promise.all(models.models.map(async (model) => {
      const { license, ...details } = await ollama.show({
        model: model.name
      });
      const capabilities = details.capabilities || [];
      return {
        capabilities,
        ...model
      };
    }));
    return modelsList;
  } catch (error: any) {
    return [`Error: ${error.message}`];
  }
}

export const getResponseFromModelUsingStream = async (req: any, res: any) => {
  try {
    const messagesRaw = req.body.messages;
    const model = (req.body.model as string) || 'gemma3:4b';

    if (!messagesRaw) {
      return res.status(400).send(generateResponse<null>('Messages are required!'));
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const stream = await ollama.chat({
      model,
      messages: messagesRaw,
      stream: true,
    });

    for await (const chunk of stream) {
      const token = chunk.message?.content || '';
      if (token) {
        res.write(`data: ${JSON.stringify({ token })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();

  } catch (error: any) {
    if (!res.headersSent) {
      res.status(500).send(generateResponse<null>('Error in getResponseFromModelUsingStream!'));
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.write("data: [DONE]\n\n");
      res.end();
    }
  }
};

export const getVisionResponseFromModelUsingStream = async (req: any, res: any) => {
  try {
    const model = (req.body?.model as string) || 'gemma3:4b';
    const rawPrompt = typeof req.body?.prompt === 'string' ? req.body.prompt.trim() : '';
    const prompt = rawPrompt.length > 0 ? rawPrompt : 'Describe the image.';
    const imageFile = req.file;

    if (!imageFile?.path) {
      return res.status(400).send(generateResponse<null>('Image file is required!'));
    }

    const imageBytes = await fs.readFile(imageFile.path);
    const imageBase64 = imageBytes.toString('base64');

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const stream = await ollama.chat({
      model,
      messages: [
        {
          role: 'user',
          content: prompt,
          images: [imageBase64],
        },
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      const token = chunk.message?.content || '';
      if (token) {
        res.write(`data: ${JSON.stringify({ token })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (error: any) {
    if (!res.headersSent) {
      res.status(500).send(generateResponse<null>('Error in getVisionResponseFromModelUsingStream!'));
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
      res.write("data: [DONE]\n\n");
      res.end();
    }
  }
};
