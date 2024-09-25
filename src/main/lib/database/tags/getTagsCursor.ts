import { Tag, TagFilter } from '../../../../types';
import { environmentManager } from '../../environment';
import { CursorResult } from '../../../../types';

export const getTags = async (
  cursor: string | null = null,  // Optional cursor for pagination
  limit: number = 1000,
  filter: TagFilter = 'All',
  query: string = '',
): Promise<CursorResult<Tag>> => {
  const prisma = environmentManager.getPrismaClient();

  // Conditionally build the where clause
  const where: any = {};

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

  // Define special filters that don't apply to `type`
  const specialFilters = ['All', 'Reported'];

  if (!specialFilters.includes(filter)) {
    // If it's not one of the special filters, apply it to the `type` field
    where.type = filter;
  } else if (filter === 'Reported') {
    where.reports = {
      some: {}, // Filter for tags with at least one report
    };
  }

  const tags = await prisma.tag.findMany({
    take: limit + 1, // Fetch one extra item to determine if there's a next page
    where, // Apply the where clause with filters and query
    cursor: cursor ? { id: cursor } : undefined, // Use cursor for pagination
    orderBy: {
      createdAt: 'asc', // Order by createdAt in ascending order
    },
  });

  const hasNextPage = tags.length > limit; // Check if there's more data for the next page
  if (hasNextPage) tags.pop(); // Remove the extra item

  const nextCursor = hasNextPage ? tags[tags.length - 1].id : null;

  return {
    data: tags,
    nextCursor,
  };
};

export default getTags;
