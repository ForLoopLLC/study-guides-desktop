import { ipcMain } from 'electron';
import { log } from '../main';
import {
  getQuestions,
  updateQuestion,
  clearQuestionReports
} from '../lib/database/questions';
import { createQuestionIndex } from '../lib/database/search';
import { publishQuestionIndex } from '../lib/search/questions';

ipcMain.handle('get-questions', async (_event, { page, limit, filter, query }) => {
  try {
    const questions = await getQuestions(page, limit, filter, query);
    return questions;
  } catch (error) {
    const err = error as Error;
    log.error('questions', `Error fetching questions: ${err.message}.`);
    throw new Error('Failed to fetch questions.');
  }
});


ipcMain.handle('update-question', async (_event, updatedTag) => {
  try {
    const question = await updateQuestion(updatedTag);
    if (!question) {
      throw new Error('Question not found');
    }
    const index = await createQuestionIndex(question);
    if (index) {
      await publishQuestionIndex([index]);
    }
    log.info('question', `${question.id} was updated the index was publish.`);
    return question;
  } catch (error) {
    const err = error as Error;
    log.error('question', `Error updating question: ${err.message}.`);
    throw new Error('Failed to update question.');
  }
});


ipcMain.handle('clear-question-reports', async (_event, id) => {
  try {
    const result = await clearQuestionReports(id);
    if (result) {
      log.info('question', `Question ${id} was cleared of reports.`);
    }
    return result;
  } catch (error) {
    const err = error as Error;
    log.error('question', `Error clearing reports for question ${id}: ${err.message}`);
    throw new Error(err.message);
  }
});
