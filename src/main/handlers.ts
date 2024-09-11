import { ipcMain } from 'electron';
import { getTags, updateTag } from './lib/database/tags';
import { createTagIndex } from './lib/database/search';
import { publishTagIndex } from './lib/search/tags';
import { UpdateTagInput } from '../types';
import { Tag } from '@prisma/client';

// Helper function to chunk array into smaller batches
function chunkArray<T>(array: T[], size: number): T[][] {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

ipcMain.handle('get-tags', async (_event, { page, limit, filter }) => {
  try {
    const tags = await getTags(page, limit, filter);
    return tags;
  } catch (error: any) {
    console.error(`Error fetching tags: ${error.message}`);
    throw new Error('Failed to fetch tags.');
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
    console.error(`Error updating tag: ${error.message}`);
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
        })
      );

      allUpdatedTags = allUpdatedTags.concat(tags.filter((tag) => tag !== null));

      // Get parent tags and create indexes for the current batch
      const indexes = (
        await Promise.all(
          tags.filter((tag) => tag !== null).map(async (tag) => {
            return await createTagIndex(tag, []);
          })
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
    console.error(`Error updating multiple tags in batches: ${error.message}`);
    throw new Error('Failed to update multiple tags.');
  }
});
