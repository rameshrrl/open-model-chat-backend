import ollama from 'ollama';

export async function askGemma(prompt: string): Promise<string> {
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
