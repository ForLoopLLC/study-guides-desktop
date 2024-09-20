import { User } from '../../../../types';
import { PrismaClient } from '@prisma/client';

/**
 * Retrieves a user with their roles from the database.
 * @function getUser
 * @memberof module:Lib/Database
 * @param {string} userId - The ID of the user to retrieve.
 * @returns {Promise<User | null>} The user with their roles or null if not found.
 * @example const userWithRoles = await getUserWithRoles(userId);
 */
export const getUser = async (
  userId: string,
  prisma: PrismaClient,
): Promise<User | null> => {
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