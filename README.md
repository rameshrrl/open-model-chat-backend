# OPEN MODEL CHAT

Open Model Chat Backend is a TypeScript + Express service that wraps local Ollama models and exposes JSON + streaming endpoints for chat and vision use cases.

## Features
- Chat with a local Ollama model.
- Stream chat responses via Server-Sent Events (SSE).
- Vision endpoint that accepts an uploaded image and streams the response.
- List available local Ollama models with additional details.

## Tech Stack
- Node.js + TypeScript
- Express + CORS
- Multer (file uploads)
- Ollama JS client

## Prerequisites
- Node.js 18+ (or newer)
- npm
- Ollama installed and running locally

## Local Setup
1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the dev server:
   ```sh
   npm run dev
   ```
3. Build and run in production mode:
   ```sh
   npm run build
   npm start
   ```

The server listens on `PORT` (default `3000`).

## Ollama Setup (Local)
1. Install Ollama for your OS:
   - macOS: install the Ollama app.
   - Linux: use the official install script.
   - Windows: use the Ollama installer.
2. Start the Ollama service.
3. Pull the default model used by this backend:

   ```sh
   ollama pull gemma3:4b
   ```
4. Verify Ollama is running:
   ```sh
   ollama list
   ```

If you want to use a different model, pass `model` in the request body to the chat/stream/vision endpoints.

## Model Switching
You can install any Ollama model you want locally and switch models per request by sending the `model` field in the payload. The backend simply forwards the model name to Ollama, so whatever you have pulled locally can be used.

Install a model:
```sh
ollama pull llama3.1:8b
```

Use that model in a request:
```json
{
  "model": "llama3.1:8b",
  "messages": [
    { "role": "user", "content": "Explain the architecture." }
  ]
}
```

Notes:
- If `model` is omitted, the server defaults to `gemma3:4b`.
- Use `ollama list` to see which models are available locally.

## API Overview
Base path: `/api/ai`

### Response Format
All JSON responses use this shape:
```json
{
  "status": true,
  "message": "Response from AI model",
  "data": "..."
}
```
On error:
```json
{
  "status": false,
  "message": "Error message",
  "error": "..."
}
```

### `POST /api/ai/chat`
Send a single prompt and receive a full response.

Request body:
```json
{
  "message": "Say hello"
}
```

Example:
```sh
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Say hello"}'
```

### `POST /api/ai/stream`
Stream tokens using SSE. You can specify a model and pass a full messages array.

Request body:
```json
{
  "model": "gemma3:4b",
  "messages": [
    { "role": "user", "content": "Summarize this project." }
  ]
}
```

Example:
```sh
curl -N -X POST http://localhost:3000/api/ai/stream \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Summarize this project."}]}'
```

The server streams SSE events as:
```text
data: {"token":"..."}

data: [DONE]
```

### `POST /api/ai/vision`
Upload an image and stream a response (SSE).

Form fields:
- `image` (file, required)
- `prompt` (string, optional)
- `model` (string, optional)

Example:
```sh
curl -N -X POST http://localhost:3000/api/ai/vision \
  -F "image=@/path/to/image.jpg" \
  -F "prompt=Describe the image."
```

### `GET /api/ai/getAvailableModelsWithDetails`
Returns local Ollama models along with capability info.

Example:
```sh
curl http://localhost:3000/api/ai/getAvailableModelsWithDetails
```

## Notes
- Uploaded files are stored in `uploads/`.
