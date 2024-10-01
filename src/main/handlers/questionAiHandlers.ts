import { ipcMain } from 'electron';
import { log } from '../main';
import {
  getQuestionInput,
} from '../lib/ai';

import { getQuestionsCursor, updateQuestion } from '../lib/database/questions';
import { createQuestionIndex } from '../lib/database/search';
import { publishQuestionIndex } from '../lib/search/questions';
import { Question } from '@prisma/client';
import { AlgoliaRecord, UpdateQuestionInput } from '../../types';
import { logAndSend } from '../util';
import { Channels } from '../../enums';


ipcMain.handle(Channels.AssistQuestion, async (_event, questionId) => {
  try {
    const questionInput = await getQuestionInput(questionId);
    log.info('ai', `Received AI assist for question ${questionInput.id}.`);
    return questionInput;
  } catch (error) {
    const err = error as Error;
    log.error(
      'ai',
      `Failed to get AI question assist for ${questionId}. ${err.message}`,
    );
    return { error: err.message };
  }
});

ipcMain.handle(Channels.BatchAssistQuestions, async (event, { filter, query }) => {
  try {
    const limit = 500;
    let allQuestions: Question[] = [];
    let nextCursor: string | null = null;
    let totalProcessed = 0;
    let hasMore = true;

    while (hasMore) {
      // Fetch questions with cursor-based pagination
      const { data: questions, nextCursor: newCursor } =
        await getQuestionsCursor(nextCursor, limit, filter, query);

      if (questions.length === 0) {
        hasMore = false;
        break;
      }

      // Process each question with AI
      const inputs = await Promise.all(
        questions.map((question) => getQuestionInput(question.id)),
      );
      allQuestions = allQuestions.concat(questions);

      // Update questions based on AI input
      const updatedQuestions = await Promise.all(
        inputs.map((input: UpdateQuestionInput) => updateQuestion(input)),
      );

      const updatedQuestionsNoNulls = updatedQuestions.filter(
        (x) => x !== null,
      );

      // Create and publish indexes for the updated questions
      const indexes = await Promise.all(
        updatedQuestionsNoNulls.map((question) =>
          createQuestionIndex(question as Question),
        ),
      );

      const indexesNoNulls = indexes.filter((x) => x !== null);

      await publishQuestionIndex(indexesNoNulls as AlgoliaRecord[]);

      // Track total processed and emit progress to the frontend
      totalProcessed += questions.length;
      const payload = { totalProcessed };
      logAndSend(event,Channels.BatchAssistQuestionsProgress, payload);
      // Move the cursor to the next set
      nextCursor = newCursor;
      if (!nextCursor) {
        hasMore = false;
      }
    }

    // Send completion event to frontend
    logAndSend(event,Channels.BatchAssistQuestionsComplete, { totalProcessed });
  } catch (error) {
    const err = error as Error;
    logAndSend(event,Channels.BatchAssistQuestionsError, { message: err.message });
    throw new Error('Failed to assist.');
  }
});
