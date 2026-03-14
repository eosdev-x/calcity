import { ChatMessage, ChatCompletionRequest, ChatCompletionResponse, ChatResponse } from './types';
import { siteConfig } from '../config/site';

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
    const response = await fetch(siteConfig.chatWorkerUrl, {
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
    content: siteConfig.chatSystemPrompt
  };
}
