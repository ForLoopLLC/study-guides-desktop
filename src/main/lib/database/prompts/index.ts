import { environmentManager } from '../../environment';
import { Prompt, PromptType } from "@prisma/client";

export const getPrompt = async (type: PromptType): Promise<Prompt | null> => {
  try {
    const prisma = environmentManager.getPrismaClient();
    const prompt = await prisma.prompt.findUnique({
      where: {
        type: type,
      },
    });

    return prompt;
  } catch (error) {
    console.error(`Error fetching prompt for ${type}`, error);
    return null;
  }
};
