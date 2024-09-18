import { Tag, TagFilter } from '../../../../types';
import { environmentManager } from '../../environment';
import { PaginatedResult } from '../../../../types';

export const getTags = async (
  page: number = 1,
  limit: number = 10,
  filter: TagFilter = 'All',
  query: string = '',
): Promise<PaginatedResult<Tag>> => {
  const prisma = environmentManager.getPrismaClient();

  const skip = (page - 1) * limit;

  // Conditionally build the where clause
  const where: any = {};

  // Apply filter if it's not 'All'
  if (filter !== 'All') {
    where.type = filter;
  }

  // Apply query to match title or id
  if (query) {
    where.OR = [
      {
        name: {
          contains: query, // Search for query in the name (case-insensitive)
          mode: 'insensitive',
        },
      },
      {
        id: {
          contains: query, // Search for query in the id (case-insensitive)
          mode: 'insensitive',
        },
      },
    ];
  }

  const [tags, total] = await Promise.all([
    prisma.tag.findMany({
      skip,
      take: limit,
      where, // Apply the where clause with filters and query
      orderBy: {
        name: 'asc', // Order by name in ascending order
      },
    }),
    prisma.tag.count({
      where, // Ensure count respects the filter and query
    }),
  ]);

  return { data: tags, total, page, limit };
};

export default getTags;
