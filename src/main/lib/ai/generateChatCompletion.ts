import { environmentManager } from '../environment';
import { log } from '../../main';

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
      temperature: 0.7,
      max_tokens: 512,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const content = completion.choices[0].message?.content || '';
    log.info('ai', '**********************************');
    log.info('ai', `model:    ${openAiModel || 'gpt-3.5-turbo'}`);
    log.info('ai', `prompt:   ${promptText}`);
    log.info('ai', `user:     ${userPrompt}`);
    log.info('ai', `response: ${content}`);
    log.info('ai', '**********************************');
    return content;
  } catch (error) {
    throw error;
  }
};
