import { User, UserFilter } from '../../../../types';
import { environmentManager } from '../../environment';
import { PaginatedResult } from '../../../../types';

export const getUsers = async (
  page: number = 1,
  limit: number = 10,
  filter: UserFilter = 'All',
  query: string = '',
): Promise<PaginatedResult<User>> => {
  const prisma = environmentManager.getPrismaClient();

  const skip = (page - 1) * limit;

  // Conditionally build the where clause
  const where: any = {};

  // Apply query to match name, email, or id
  if (query) {
    where.OR = [
      {
        name: {
          contains: query, // Search for query in the name (case-insensitive)
          mode: 'insensitive',
        },
      },
      {
        email: {
          contains: query, // Search for query in the email (case-insensitive)
          mode: 'insensitive',
        },
      },
      {
        gamerTag: {
          contains: query, // Search for query in the id (case-insensitive)
          mode: 'insensitive',
        },
      },
    ];
  }

  // Apply filters for user roles
  if (filter === 'Admin') {
    where.roles = {
      some: {
        role: {
          name: 'admin', // Filter for admin role
        },
      },
    };
  } else if (filter === 'User') {
    where.roles = {
      some: {
        role: {
          name: 'user', // Filter for user role
        },
      },
    };
  } else if (filter === 'Tester') {
    where.roles = {
      some: {
        role: {
          name: 'tester', // Filter for tester role
        },
      },
    };
  } else if (filter === 'Freelancer') {
    where.roles = {
      some: {
        role: {
          name: 'freelancer', // Filter for freelancer role
        },
      },
    };
  }

  // Fetch the users and total count
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      where, // Apply the where clause with filters and query
      orderBy: {
        createdAt: 'asc', // Order by creation date in ascending order
      },
      include: {
        roles: {
          include: {
            role: true, // Include role details
          },
        },
      },
    }),
    prisma.user.count({
      where, // Ensure count respects the filter and query
    }),
  ]);


  return { data: users, total, page, limit };
};

export default getUsers;
