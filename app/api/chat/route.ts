import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFileSync } from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

function getSystemPrompt(): string {
  try {
    const filePath = path.join(process.cwd(), 'chatbot', 'system_prompt.txt');
    return readFileSync(filePath, 'utf-8');
  } catch {
    return 'You are a helpful assistant for a Devoteam presentation about CMA CGM.';
  }
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'GEMINI_API_KEY is not configured.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let messages: { role: 'user' | 'model'; content: string }[];
  try {
    const body = await req.json();
    messages = body.messages;
    if (!Array.isArray(messages) || messages.length === 0) throw new Error();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid request body.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const systemPrompt = getSystemPrompt();
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction: systemPrompt,
  });

  // Build history (all messages except the last user message)
  const history = messages.slice(0, -1).map((m) => ({
    role: m.role,
    parts: [{ text: m.content }],
  }));

  const userMessage = messages[messages.length - 1].content;

  try {
    const chat = model.startChat({ history });
    const result = await chat.sendMessageStream(userMessage);

    // Stream the response as Server-Sent Events
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        } catch (err) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: 'Stream error' })}\n\n`)
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err: any) {
    console.error('Gemini API error:', err);
    return new Response(
      JSON.stringify({ error: err?.message ?? 'Failed to call Gemini API.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
