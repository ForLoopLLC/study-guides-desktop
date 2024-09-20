import { ipcMain } from 'electron';
import { log } from '../main';
import { getTagInput, getContentRatingInput } from '../lib/ai';

import { getTags, touchTag, updateTag } from '../lib/database/tags';
import { createTagIndex } from '../lib/database/search';
import { publishTagIndex } from '../lib/search/tags';
import { Tag } from '@prisma/client';

// todo batch-assist-tags

ipcMain.handle('get-ai-content-rating', async (_event, tagId) => {
  try {
    const tagInput = await getContentRatingInput(tagId);
    log.info('ai', `Received AI content rating for tag ${tagInput.name}.`);
    return tagInput;
  } catch (error) {
    const err = error as Error;
    log.error(
      'ai',
      `Failed to get AI tag content rating for ${tagId}. ${err.message}`,
    );
    return { error: err.message };
  }
});

ipcMain.handle('get-ai-tag', async (_event, tagId) => {
  console.log('calling get-ai-tag');
  try {
    const tagInput = await getTagInput(tagId);
    log.info('ai', `Received AI assist for tag ${tagInput.name}.`);
    return tagInput;
  } catch (error) {
    const err = error as Error;
    log.error('ai', `Failed to get AI tag assist for ${tagId}. ${err.message}`);
    return { error: err.message };
  }
});

ipcMain.handle('batch-assist-tags', async (event, { filter, query }) => {
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

      const inputs = await Promise.all(tags.map((tag) => getTagInput(tag.id)));

      allTags = allTags.concat(tags);
      page += 1;

      const updatedTags = await Promise.all(
        inputs.map((input) => updateTag(input)),
      );
      const indexes = await Promise.all(
        updatedTags
          .filter((x) => x !== null)
          .map((tag) => createTagIndex(tag, [])),
      );

      await publishTagIndex(indexes.filter((index) => index !== null));

      totalProcessed += tags.length;
      const payload = { page, totalProcessed };
      event.sender.send('batch-assist-tags-progress', payload);
      log.info('ai', `Assisted ${totalProcessed} tags.`);
    }

    event.sender.send('batch-assist-tags-complete', { totalProcessed });
    log.info('ai', `Assist completeed with ${totalProcessed} tags.`);
  } catch (error) {
    const err = error as Error;
    log.error('ai', `Error assisting: ${err.message}`);
    event.sender.send('batch-assist-tags-error', { message: err.message });
    throw new Error('Failed to assist.');
  }
});
