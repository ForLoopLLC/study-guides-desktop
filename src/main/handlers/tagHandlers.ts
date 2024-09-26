import { ipcMain } from 'electron';
import { log } from '../main';
import {
  getTags,
  updateTag,
  getTagWithRelations,
  deleteTag,
  clearTagReports,
  getTagAncestry,
} from '../lib/database/tags';
import { createTagIndex, deleteTagIndex } from '../lib/database/search';
import {
  publishTagIndex,
  unpublishTagIndex,

} from '../lib/search/tags';

ipcMain.handle('get-tags', async (_event, { page, limit, filter, query }) => {
  try {
    const tags = await getTags(page, limit, filter, query);
    return tags;
  } catch (error) {
    const err = error as Error;
    log.error('tags', `Error fetching tags: ${err.message}.`);
    throw new Error('Failed to fetch tags.');
  }
});

ipcMain.handle('get-tag-with-relations', async (_event, id) => {
  try {
    const tag = await getTagWithRelations(id);
    return tag;
  } catch (error) {
    const err = error as Error;
    log.error('tags', `Error fetching tag: ${err.message}.`);
    throw new Error('Failed to fetch tag.');
  }
});

ipcMain.handle('update-tag', async (_event, updatedTag) => {
  try {
    const tag = await updateTag(updatedTag);
    if (!tag) {
      throw new Error('Tag not found');
    }
    const tagInfos = await getTagAncestry(tag.id);
    const index = await createTagIndex(tag, tagInfos);
    if (index) {
      await publishTagIndex([index]);
    }
    log.info('tag', `${tag.name} was updated the index was publish.`);
    return tag;
  } catch (error) {
    const err = error as Error;
    log.error('tag', `Error updating tag: ${err.message}.`);
    throw new Error('Failed to update tag.');
  }
});

ipcMain.handle('delete-tag', async (_event, id) => {
  try {
    const result = await deleteTag(id);
    if (result) {
      await deleteTagIndex(id);
      await unpublishTagIndex(id);
      log.info('tag', `Tag ${id} deleted and unpublished.`);
    }
    return result;
  } catch (error) {
    const err = error as Error;
    log.error('tag', `Error deleting tag ${id}: ${err.message}`);
    throw new Error(err.message);
  }
});

ipcMain.handle('clear-tag-reports', async (_event, id) => {
  try {
    const result = await clearTagReports(id);
    if (result) {
      log.info('tag', `Tag ${id} was cleared of reports.`);
    }
    return result;
  } catch (error) {
    const err = error as Error;
    log.error('tag', `Error clearing reports for tag ${id}: ${err.message}`);
    throw new Error(err.message);
  }
});
