import { ipcMain } from 'electron';
import { log } from '../main';
import { getTags, updateTag, getTagWithRelations, deleteTag } from '../lib/database/tags';
import { createTagIndex } from '../lib/database/search';
import { publishTagIndex } from '../lib/search/tags';

ipcMain.handle('get-tags', async (_event, { page, limit, filter, query }) => {
  try {
    const tags = await getTags(page, limit, filter, query);
    return tags;
  } catch (error) {
    const err = error as Error;
    log.error('tags',`Error fetching tags: ${err.message}.`);
    throw new Error('Failed to fetch tags.');
  }
});

ipcMain.handle('get-tag-with-relations', async (_event, id) => {
  try {
    const tag = await getTagWithRelations(id);
    return tag;
  } catch (error) {
    const err = error as Error;
    log.error('tags',`Error fetching tag: ${err.message}.`);
    throw new Error('Failed to fetch tag.');
  }
});

ipcMain.handle('update-tag', async (_event, updatedTag) => {
  try {
    const tag = await updateTag(updatedTag);
    if (!tag) {
      throw new Error('Tag not found');
    }
    const index = await createTagIndex(tag, []);
    if (index) {
      await publishTagIndex([index]);
    }
    return tag;
  } catch (error) {
    const err = error as Error;
    log.error('tag',`Error updating tag: ${err.message}.`);
    throw new Error('Failed to update tag.');
  }
});

ipcMain.handle('delete-tag', async (_event, id) => {
  try {
    const result = await deleteTag(id);
    if (result) {
      log.info('tag',`Tag deleted: ${id}.`);
    }
    return result;
  } catch (error) {
    const err = error as Error;
    log.error('tag',`Error deleting tag: ${err.message}.`);
    throw new Error(err.message);
  }
});
