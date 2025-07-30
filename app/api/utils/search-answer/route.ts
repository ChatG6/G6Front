import { NextRequest, NextResponse } from 'next/server';
import { AnthropicStream } from '../../../utils/anthropicStream';

export async function POST(req: NextRequest): Promise<Response> {
  try {
    const { prompt, apiKey } = (await req.json()) as {
      prompt: string;
      apiKey: string;
    };
    console.log(prompt)
    console.log(apiKey)
    const stream = await AnthropicStream(prompt, apiKey);
    const reader = stream.getReader();
    const decoder = new TextDecoder();
     let done = false;
       while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        console.log(chunkValue);

      }
    console.log('done answering')
    //console.log(stream)
    return new NextResponse(stream);
  } catch (error) {
    console.error(error);
    return NextResponse.json({Error: 'Error'}, { status: 500 });
  }
};