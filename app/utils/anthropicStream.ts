import { createParser, ParsedEvent, ReconnectInterval } from 'eventsource-parser';

export const AnthropicStream = async (prompt: string, apiKey: string) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    method: 'POST',
    body: JSON.stringify({
      model: 'claude-3-7-sonnet-20250219',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt
            }
          ]
        }
      ],
      system: `You are a helpful assistant that accurately answers queries using GitHub Privacy Statement. Use the text provided to form your answer, but avoid copying word-for-word from the context. Try to use your own words when possible. Keep your answer under 5 sentences. Be accurate, helpful, concise, and clear.`,
      temperature: 0.1,
      stream: true
    })
  });

  if (res.status !== 200) {
    console.log(res.status)
    const errorData = await res.json().catch(() => ({}));
    console.log(errorData)
    throw new Error(`Anthropic API returned an error: ${JSON.stringify(errorData)}`);
  }

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === 'event') {
          const data = event.data;

          if (data === '[DONE]') {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            
            // Check for content block delta events from Anthropic's streaming format
            if (json.type === 'content_block_delta' && 
                json.delta && 
                json.delta.type === 'text_delta') {
              const text = json.delta.text;
              if (text) {
                const queue = encoder.encode(text);
                controller.enqueue(queue);
              }
            }
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    }
  });
  console.log(stream)
  return stream;
};