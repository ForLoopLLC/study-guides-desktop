import { UpdateUserInput } from '../../../../types';
import { environmentManager } from '../../environment';
import { log } from '../../../main';
import { User } from '@prisma/client';

const updateTag = async (input: UpdateUserInput): Promise<User | null> => {
  const prisma = environmentManager.getPrismaClient();

  try {
    // Perform the update with merged metadata
    const updatedUser = await prisma.user.update({
      where: { id: input.id },
      data: {
        gamerTag: input.gamerTag,
      },
    });

    return updatedUser;
  } catch (error) {
    const err = error as Error;
    return null;
  }
};

export default updateTag;
