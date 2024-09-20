import { environmentManager } from '../../environment';
import { Prompt, PromptType } from "@prisma/client";
import { log } from '../../../main';

export const getXPrompt = async (type: PromptType): Promise<Prompt | null> => {
  try {
    const prisma = environmentManager.getPrismaClient();
    const prompt = await prisma.prompt.findUnique({
      where: {
        type: type,
      },
    });

    return prompt;
  } catch (error) {
    const err = error as Error;
    log.error(`prompts`,`Error fetching prompt for ${type}. ${err.message}.`);
    return null;
  }
};
