import { Configuration, OpenAIApi } from 'openai-edge'

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.GROQ_API_KEY,
  basePath: 'https://api.groq.com/openai/v1',
})
const openai = new OpenAIApi(config)

// Set the runtime to edge for best performance
export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Ask Groq for a non-streaming chat completion given the prompt
  const response = await openai.createChatCompletion({
    model: 'mixtral-8x7b-32768',
    messages,
  });

  // Respond with the stream
  return response
}
