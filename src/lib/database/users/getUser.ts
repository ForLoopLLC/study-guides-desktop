import { prisma } from "../index";
import { User } from "../../../types";

/**
 * Retrieves a user with their roles from the database.
 * @function getUser
 * @memberof module:Lib/Database
 * @param {string} userId - The ID of the user to retrieve.
 * @returns {Promise<User | null>} The user with their roles or null if not found.
 * @example const userWithRoles = await getUserWithRoles(userId);
 */
export const getUser = async (
  userId: string
): Promise<User | null> => {
  if (!userId) {
    return null;
  }

  const userWithRoles = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  });

  if (!userWithRoles) {
    return null;
  }

  return {
    ...userWithRoles,
    roles: userWithRoles.roles.map((userRole) => ({
      ...userRole,
      role: userRole.role,
    })),
  };
};
