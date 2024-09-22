import { OpenAIStream, StreamingTextResponse } from 'ai'
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
  const { messages, temperature, topP } = await req.json();
  console.log(messages, temperature, topP);

  // Ask Groq for a streaming chat completion given the prompt
  const response = await openai.createChatCompletion({
    model: 'mixtral-8x7b-32768',
    stream: true,
    messages,
    temperature: temperature,
    top_p: topP,
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream)
}
