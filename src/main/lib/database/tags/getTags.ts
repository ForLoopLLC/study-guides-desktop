import { Tag, TagFilter } from '../../../../types';
import { environmentManager } from '..';
import { PaginatedResult } from '../../../../types';

export const getTags = async (
  page: number = 1,
  limit: number = 10,
  filter: TagFilter = 'All',
): Promise<PaginatedResult<Tag>> => {
  const prisma = environmentManager.getPrismaClient();

  const skip = (page - 1) * limit;

  // Conditionally apply the filter if it's not 'All'
  const where = filter !== 'All' ? { type: filter } : {};

  const [tags, total] = await Promise.all([
    prisma.tag.findMany({
      skip,
      take: limit,
      where, // Apply the where clause conditionally
      orderBy: {
        name: 'asc', // Order by name in ascending order
      },
    }),
    prisma.tag.count({
      where, // Ensure count respects the filter as well
    }),
  ]);

  return { data: tags, total, page, limit };
};

export default getTags;
