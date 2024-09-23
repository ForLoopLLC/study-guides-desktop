import { User } from '../../../../types';
import { environmentManager } from '../../environment';

export const getUser = async (
  userId: string,
): Promise<User | null> => {

  const prisma = environmentManager.getPrismaClient();

  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  return user
};


export default getUser;