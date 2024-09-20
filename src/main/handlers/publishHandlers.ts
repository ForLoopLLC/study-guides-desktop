import { ipcMain } from 'electron';
import { log } from '../main';
import { getTags, touchTag } from '../lib/database/tags';
import { createTagIndex } from '../lib/database/search';
import { publishTagIndex } from '../lib/search/tags';
import { getUsers } from '../lib/database/users';
import { createUserIndex } from '../lib/database/search';
import { publishUserIndex } from '../lib/search/users';
import { User, Tag } from '@prisma/client';

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
      await publishUserIndex(indexes.filter((index) => index !== null));

      totalProcessed += users.length;
      const payload = { page, totalProcessed };
      event.sender.send('publish-users-index-progress', payload);
      log.info('publish', `Processed ${totalProcessed} tags.`);
    }

    event.sender.send('publish-users-index-complete', { totalProcessed });
    log.info('publish', `Index published with ${totalProcessed} tags.`);
  } catch (error) {
    const err = error as Error;
    log.error('publish', `Error publishing index: ${err.message}`);
    event.sender.send('publish-users-index-error', { message: err.message });
    throw new Error('Failed to publish index.');
  }
});
