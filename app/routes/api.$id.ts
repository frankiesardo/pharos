import { ActionFunctionArgs } from "@remix-run/cloudflare";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { streamText, Message, CoreMessage } from "ai";

const openai = createOpenAICompatible({
  name: "openai-proxy",
  baseURL: `${process.env.OPENAI_API_BASE_URL}`,
  headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
});

export async function action({ request, params, context }: ActionFunctionArgs) {
  const { BUCKET } = context.cloudflare.env;
  const { messages } = await request.json<{ messages: Message[] }>();
  const { id } = params;
  const key = id + ".txt"
  const object = await BUCKET.get(key);
  const text = await object?.text()

  const systemMessage: CoreMessage = {
    role: "system",
    content: `
Answer all questions related to this book.
You can quote some passages but you MUST decline if the user asks you to quote more than one or two paragraphs, for copyright reasons.
You can use markdown formatting in your reply.

--- BEGIN BOOK ---
${text}
--- END BOOK ---
    `,
  };

  const result = streamText({
    model: openai("google:gemini-1.5-pro-001"),
    messages: [systemMessage, ...messages],
  });

  return result.toDataStreamResponse();
};