import { Question, QuestionFilter } from '../../../../types';
import { environmentManager } from '../../environment';
import { PaginatedResult } from '../../../../types';

export const getQuestions = async (
  page: number = 1,
  limit: number = 10,
  filter: QuestionFilter = 'All',
  query: string = '',
): Promise<PaginatedResult<Question>> => {
  const prisma = environmentManager.getPrismaClient();

  const skip = (page - 1) * limit;

  // Conditionally build the where clause
  const where: any = {};

  // Apply query to match title or id
  if (query) {
    where.OR = [
      {
        questionText: {
          contains: query, // Search for query in the name (case-insensitive)
          mode: 'insensitive',
        },
      },
      {
        answerText: {
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

   if (filter === 'All') {
     // no where clause needed
   } else if (filter === 'Reported') {
     where.reports = {
       some: {}, // Filter for tags with at least one report
     };
   }

  const [questions, total] = await Promise.all([
    prisma.question.findMany({
      skip,
      take: limit,
      where, // Apply the where clause with filters and query
      orderBy: {
        questionText: 'asc', // Order by name in ascending order
      },
    }),
    prisma.question.count({
      where, // Ensure count respects the filter and query
    }),
  ]);

  return { data: questions, total, page, limit };
};

export default getQuestions;
