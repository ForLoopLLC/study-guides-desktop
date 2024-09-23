import { ipcMain } from 'electron';
import { log } from '../main';
import { getTags, touchTag } from '../lib/database/tags';
import { getQuestions, touchQuestion } from '../lib/database/questions';
import { createTagIndex } from '../lib/database/search';
import { publishTagIndex } from '../lib/search/tags';
import { getUsers } from '../lib/database/users';
import { createUserIndex } from '../lib/database/search';
import { publishUsersIndex } from '../lib/search/users';
import { publishQuestionIndex } from '../lib/search/questions';
import { createQuestionIndex } from '../lib/database/search';
import { User, Tag, Question } from '@prisma/client';

ipcMain.handle('publish-tags-index', async (event, { filter, query }) => {
  try {
    let page = 1;
    const limit = 500;
    let allTags: Tag[] = [];
    let hasMore = true;
    let totalProcessed = 0;

    while (hasMore) {
      const { data: tags } = await getTags(page, limit, filter, query);
      if (tags.length === 0) {
        hasMore = false;
        break;
      }

      allTags = allTags.concat(tags);
      page += 1;

      const touchedTags = await Promise.all(
        tags.map((tag) => touchTag(tag.id)),
      );
      const indexes = await Promise.all(
        touchedTags.map((tag) => createTagIndex(tag, [])),
      );
      await publishTagIndex(indexes.filter((index) => index !== null));

      totalProcessed += tags.length;
      const payload = { page, totalProcessed };
      event.sender.send('publish-tags-index-progress', payload);
      log.info('publish', `Processed ${totalProcessed} tags.`);
    }

    event.sender.send('publish-tags-index-complete', { totalProcessed });
    log.info('publish', `Index published with ${totalProcessed} tags.`);
  } catch (error) {
    const err = error as Error;
    log.error('publish', `Error publishing index: ${err.message}`);
    event.sender.send('publish-tags-index-error', { message: err.message });
    throw new Error('Failed to publish index.');
  }
});

ipcMain.handle('publish-users-index', async (event, { filter, query }) => {
  try {
    let page = 1;
    const limit = 500;
    let allUsers: User[] = [];
    let hasMore = true;
    let totalProcessed = 0;

    while (hasMore) {
      const { data: users } = await getUsers(page, limit, filter, query);
      if (users.length === 0) {
        hasMore = false;
        break;
      }

      allUsers = allUsers.concat(users);
      page += 1;

      const indexes = await Promise.all(
        users.map((user) => createUserIndex(user)),
      );
      await publishUsersIndex(indexes.filter((index) => index !== null));

      totalProcessed += users.length;
      const payload = { page, totalProcessed };
      event.sender.send('publish-users-index-progress', payload);
      log.info('publish', `Processed ${totalProcessed} users.`);
    }

    event.sender.send('publish-users-index-complete', { totalProcessed });
    log.info('publish', `Index published with ${totalProcessed} users.`);
  } catch (error) {
    const err = error as Error;
    log.error('publish', `Error publishing index: ${err.message}`);
    event.sender.send('publish-users-index-error', { message: err.message });
    throw new Error('Failed to publish index.');
  }
});

ipcMain.handle('publish-questions-index', async (event, { filter, query }) => {
  try {
    let page = 1;
    const limit = 500;
    let allQuestions: Question[] = [];
    let hasMore = true;
    let totalProcessed = 0;

    while (hasMore) {
      const { data: questions } = await getQuestions(
        page,
        limit,
        filter,
        query,
      );
      if (questions.length === 0) {
        hasMore = false;
        break;
      }

      allQuestions = allQuestions.concat(questions);
      page += 1;

      const touchedQuestions = await Promise.all(
        questions.map((question) => touchQuestion(question.id)),
      );
      const indexes = await Promise.all(
        touchedQuestions.map((question) => createQuestionIndex(question)),
      );
      await publishQuestionIndex(indexes.filter((index) => index !== null));

      totalProcessed += questions.length;
      const payload = { page, totalProcessed };
      event.sender.send('publish-questions-index-progress', payload);
      log.info('publish', `Processed ${totalProcessed} questions.`);
    }

    event.sender.send('publish-questions-index-complete', { totalProcessed });
    log.info('publish', `Index published with ${totalProcessed} questions.`);
  } catch (error) {
    const err = error as Error;
    log.error('publish', `Error publishing index: ${err.message}`);
    event.sender.send('publish-questions-index-error', {
      message: err.message,
    });
    throw new Error('Failed to publish index.');
  }
});
