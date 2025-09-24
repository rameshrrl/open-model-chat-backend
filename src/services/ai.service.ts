import axios from 'axios';

export async function askGemma(prompt: string): Promise<string> {
  try {
    const response = await axios.post('http://localhost:11434/api/chat', {
      model: 'gemma3:4b',
      messages: [{ role: 'user', content: prompt }],
      stream: false
    });
    return response.data.message?.content || '';
  } catch (error: any) {
    return `Error: ${error.message}`;
  }
}

// const fs = require('fs');

// // Replace with your Ollama server URL
// const ollamaApiUrl = 'http://localhost:1234/api/generate';

// async function processImageWithGemma(imagePath: string) {
//   try {
//     // 1. Read the image file
//     const imageBuffer = fs.readFileSync(imagePath);

//     // 2. Encode the image to base64
//     const base64Image = base64Encode(imageBuffer);

//     // 3. Construct the prompt (include the image data)
//     const prompt = `Describe the following image: ${base64Image}`; // Adjust prompt as needed

//     // 4. Make the request to the Ollama API
//     const response = await axios.post(ollamaApiUrl, {
//       headers: {
//         'Content-Type': 'text/plain' // Or other appropriate content type
//       },
//       data: prompt
//     });

//     // 5. Handle the response
//     const result = response.data;
//     console.log('Ollama Response:', result);
//     return result;

//   } catch (error) {
//     console.error('Error processing image with Gemma:', error);
//     throw error; // Re-throw the error for the caller to handle
//   }
// }


// function base64Encode(buffer: Buffer | string): string {
//   buffer = Buffer.from(buffer);
//   const base64 = buffer.toString('base64');
//   return base64;
// }

// // Example usage:
// const imageFilePath = 'path/to/your/image.jpg'; // Replace with the actual path
// processImageWithGemma(imageFilePath)
//   .then(result => {
//     console.log('Final Result:', result);
//   })
//   .catch(error => {
//     console.error('Error occurred in main function', error);
//   });
