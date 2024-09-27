import { Configuration, OpenAIApi, ResponseTypes } from 'openai-edge'

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.GROQ_API_KEY,
  basePath: 'https://api.groq.com/openai/v1',
})
const openai = new OpenAIApi(config)

// Set the runtime to edge for best performance
export const runtime = 'edge'

export async function GET() {
  // Ask Groq for a non-streaming chat completion given the prompt
  const response = await openai.listModels();
  const data = (await response.json() as ResponseTypes["listModels"]);
  const  modelNames = data.data.map((model: {id: string}) => model.id);

  // Respond with the stream
  return new Response(JSON.stringify(modelNames));
}
