import { environmentManager } from '../environment';
import { stripBackticks } from '../../util';
import { log } from '../../main';
import { env } from 'process';

export const generateChatCompletion = async (
  promptText: string,
  userPrompt: string,
): Promise<string> => {
  try {
    const client = environmentManager.getAiClient();
    const { openAiModel } = environmentManager.getEnvironment();
    const completion = await client.chat.completions.create({
      model: openAiModel || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: promptText,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const content = completion.choices[0].message?.content || '';
    const cleanedResult = stripBackticks(content);
    return cleanedResult;
  } catch (error) {
    throw error;
  }
};
