import axios from 'axios';

export async function askGemma(prompt: string): Promise<string> {
  try {
    const response = await axios.post('http://localhost:11434/api/chat', {
      model: 'gemma3:270m',
      messages: [{ role: 'user', content: prompt }],
      stream: false
    });
    // Ollama chat API returns response in response.data.message.content
    return response.data.message?.content || '';
  } catch (error: any) {
    return `Error: ${error.message}`;
  }
}
