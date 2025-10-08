import ollama from 'ollama';
import { generateResponse } from '../helpers/response';

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

