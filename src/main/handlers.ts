import { ipcMain } from 'electron';
import log from 'electron-log';
import {
  getTags,
  updateTag,
  touchTag,
  getTagWithRelations,
} from './lib/database/tags';
import { createTagIndex } from './lib/database/search';
import { publishTagIndex } from './lib/search/tags';
import { UpdateTagInput, LogLevel } from '../types';
import { Tag } from '@prisma/client';
import { chunkArray } from './util';

ipcMain.on('log-message', (_event, level: string, message: string) => {
  if (['info', 'warn', 'error', 'debug', 'verbose', 'silly'].includes(level)) {
    (log as any)[level as LogLevel](message);
  } else {
    log.error(`Invalid log level: ${level}`);
  }
});


ipcMain.handle('get-tags', async (_event, { page, limit, filter }) => {
  try {
    const tags = await getTags(page, limit, filter);
    return tags;
  } catch (error: any) {
    log.error(`Error fetching tags: ${error.message}`);
    throw new Error('Failed to fetch tags.');
  }
});

ipcMain.handle('publish-index', async (event, filter) => {
  try {
    let page = 1;
    const limit = 500;
    let allTags: Tag[] = [];
    let hasMore = true;
    let totalProcessed = 0;

    // Loop through all pages
    while (hasMore) {
      const { data: tags } = await getTags(page, limit, filter);

      if (tags.length === 0) {
        hasMore = false;
        break;
      }

      allTags = allTags.concat(tags);
      page += 1; // Increment page to fetch the next set of results

      // Touch and publish tags after each page is fetched
      const touchedTags = await Promise.all(
        tags.map((tag) => touchTag(tag.id)),
      );
      const indexes = await Promise.all(
        touchedTags.map((tag) => createTagIndex(tag, [])),
      );
      await publishTagIndex(indexes.filter((index) => index !== null));

      // Update total processed and send progress
      totalProcessed += tags.length;
      const payload = { page, totalProcessed };
      event.sender.send('publish-index-progress', payload);
    }

    event.sender.send('publish-index-complete', { totalProcessed });
  } catch (error: any) {
    log.error(`Error publishing index: ${error.message}`);
    event.sender.send('publish-index-error', { message: error.message });
    throw new Error('Failed to publish index.');
  }
});

ipcMain.handle('get-tag-with-relations', async (_event, id) => {
  try {
    const tag = await getTagWithRelations(id);
    return tag;
  } catch (error: any) {
    log.error(`Error fetching tag: ${error.message}`);
    throw new Error('Failed to fetch tag.');
  }
});

ipcMain.handle('update-tag', async (_event, updatedTag) => {
  try {
    const tag = await updateTag(updatedTag);
    if (!tag) {
      throw new Error('Tag not found');
    }

    // Get parent tags and create the index
    const index = await createTagIndex(tag, []);
    if (index) {
      await publishTagIndex([index]);
    }

    return tag;
  } catch (error: any) {
    log.error(`Error updating tag: ${error.message}`);
    throw new Error('Failed to update tag.');
  }
});

ipcMain.handle('update-tags', async (_event, updatedTags) => {
  try {
    // Chunk the list of updatedTags into batches of 500
    const tagBatches = chunkArray<UpdateTagInput>(updatedTags, 500);

    let allUpdatedTags: Tag[] = [];

    for (const batch of tagBatches) {
      // Update the tags in batches
      const tags = await Promise.all(
        batch.map(async (tag: UpdateTagInput) => {
          return await updateTag(tag);
        }),
      );

      allUpdatedTags = allUpdatedTags.concat(
        tags.filter((tag) => tag !== null),
      );

      // Get parent tags and create indexes for the current batch
      const indexes = (
        await Promise.all(
          tags
            .filter((tag) => tag !== null)
            .map(async (tag) => {
              return await createTagIndex(tag, []);
            }),
        )
      ).filter((index) => index !== null); // Filter out null indexes

      if (indexes.length === 0) {
        throw new Error('No valid indexes created for the tags.');
      }

      // Publish the current batch of indexes to Algolia
      await publishTagIndex(indexes);
    }

    return allUpdatedTags;
  } catch (error: any) {
    log.error(`Error updating multiple tags in batches: ${error.message}`);
    throw new Error('Failed to update multiple tags.');
  }
});
