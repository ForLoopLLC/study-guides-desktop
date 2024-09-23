import { UpdateUserInput } from '../../../../types';
import { environmentManager } from '../../environment';
import { log } from '../../../main';
import { User } from '@prisma/client';

const updateTag = async (input: UpdateUserInput): Promise<User | null> => {
  const prisma = environmentManager.getPrismaClient();

  try {
    // handle roles
    await prisma.userRole.deleteMany({
      where: { userId: input.id },
    });

    if (input.roles) {
      await prisma.userRole.createMany({
        data: input.roles.map((role) => ({roleId: role.role.id, userId: input.id})),
      });
    }
    // Perform the update with the roles and gamerTag
    const updatedUser = await prisma.user.update({
      where: { id: input.id },
      data: {
        gamerTag: input.gamerTag,
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    return updatedUser;
  } catch (error) {
    const err = error as Error;
    throw new Error(`Failed to update user: ${err.message}`);
  }
};

export default updateTag;
