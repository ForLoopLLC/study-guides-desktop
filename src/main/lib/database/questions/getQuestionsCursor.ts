import { Question, QuestionFilter } from '../../../../types';
import { environmentManager } from '../../environment';
import { CursorResult } from '../../../../types'; // Assuming CursorResult is the new interface

export const getQuestions = async (
  cursor: string | null = null, // Cursor for pagination
  limit: number = 1000,
  filter: QuestionFilter = 'All',
  query: string = '',
): Promise<CursorResult<Question>> => {
  const prisma = environmentManager.getPrismaClient();

  // Conditionally build the where clause
  const where: any = {};

  // Apply query to match title or id
  if (query) {
    where.OR = [
      {
        questionText: {
          contains: query,
          mode: 'insensitive',
        },
      },
      {
        answerText: {
          contains: query,
          mode: 'insensitive',
        },
      },
      {
        id: {
          contains: query,
          mode: 'insensitive',
        },
      },
    ];
  }

  if (filter === 'All') {
    // No where clause needed
  } else if (filter === 'Reported') {
    where.reports = {
      some: {},
    };
  } else if (filter === 'MissingLearnMore') {
    where.learnMore = {
      equals: '', // Check for empty string
    };
  } else if (filter === 'MissingDistractors') {
    where.OR = [
      {
        distractors: {
          isEmpty: true,
        },
      },
    ];
  }

  const questions = await prisma.question.findMany({
    take: limit + 1, // Fetch one more item to check if there's a next page
    where,
    cursor: cursor ? { id: cursor } : undefined, // Apply cursor if provided
    skip: cursor ? 1 : 0, // Skip the cursor itself
    orderBy: {
      createdAt: 'asc',
    },
  });

  const hasNextPage = questions.length > limit; // Determine if there's a next page
  const nextCursor = hasNextPage ? questions[limit - 1].id : null; // Set the next cursor if there are more items

  return {
    data: hasNextPage ? questions.slice(0, -1) : questions, // Exclude the extra fetched item if next page exists
    nextCursor,
  };
};

export default getQuestions;
