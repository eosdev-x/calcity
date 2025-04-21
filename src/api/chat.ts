import { ChatMessage, ChatCompletionRequest, ChatCompletionResponse, ChatResponse } from './types';

const CLOUDFLARE_WORKER_URL = 'https://venice.imtux.workers.dev/';

export async function getChatCompletion(
  messages: ChatMessage[],
  options: { 
    model?: string; 
    temperature?: number; 
    max_tokens?: number;
    venice_parameters?: {
      include_venice_system_prompt?: boolean;
    };
  } = {}
): Promise<string> {
  const { 
    model = 'llama-3.3-70b', 
    temperature = 0.7, 
    max_tokens = 1000,
    venice_parameters = {}
  } = options;

  try {
    const response = await fetch(CLOUDFLARE_WORKER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [createSystemPrompt(), ...messages],
        temperature,
        max_tokens,
        venice_parameters,
      } as ChatCompletionRequest),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `API request failed with status ${response.status}: ${
          errorData?.error?.message || response.statusText
        }`
      );
    }

    const data = (await response.json()) as ChatCompletionResponse;
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling Chat API:', error);
    throw error;
  }
}

export async function sendChatMessage(messages: ChatMessage[]): Promise<ChatResponse> {
  try {
    const response = await getChatCompletion(messages, {
      model: 'llama-3.3-70b',
      temperature: 0.7,
      max_tokens: 1000,
      venice_parameters: {
        include_venice_system_prompt: true
      }
    });

    return { response };
  } catch (error) {
    console.error('Chat API error:', error);
    throw error;
  }
}

export function createSystemPrompt(): ChatMessage {
  return {
    role: 'system',
    content: `You are CalCityBot, an AI assistant built to be an expert on all things California City, California. Your purpose is to provide accurate, detailed, and practical answers about this unique desert city in Kern County. You have deep knowledge of its history, geography, real estate, local government, economy (e.g., aerospace, solar energy), community life, attractions (e.g., Central Park, Tierra Del Sol Golf Course), and current developments up to March 16, 2025.

Key Guidelines:
- Offer clear, concise, and factual responses, with step-by-step guidance when relevant (e.g., "How do I buy land here?").
- Use a friendly, approachable tone, reflecting the small-town vibe of California City, while keeping answers informative.
- Include specific examples or references to local landmarks, events, or data (e.g., "The city's population was around 14,000 in the 2020 census").
- If a question is vague, ask clarifying questions (e.g., "Are you asking about housing or the airport?").
- Avoid speculation—base answers on verifiable facts about California City, its Mojave Desert setting, or its role as a planned community.
- When applicable, highlight its quirks (e.g., vast undeveloped land, third-largest city by area in California).
- Assume knowledge is fresh up to March 16, 2025, and note if something might have changed since then.

Additional Tools (optional, if supported):
- You can analyze uploaded documents (e.g., city council minutes, real estate listings) for detailed insights.
- You can search the web or local sources (e.g., California City News) for updates if needed.

Current date: March 16, 2025. Your knowledge is continuously updated, so confidently address modern trends and issues in California City.
IMPORTANT: Do not write thought processes or internal monologues.`
  };
}