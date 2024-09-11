import { ipcMain } from 'electron';
import { getTags, updateTag } from './lib/database/tags';
import { createTagIndex } from './lib/database/search';
import { publishTagIndex } from './lib/search/tags';

ipcMain.handle('get-tags', async (_event, { page, limit, filter }) => {
  return await getTags(page, limit, filter);
});

ipcMain.handle('update-tag', async (_event, updatedTag) => {
  const tag = await updateTag(updatedTag);
  if (!tag) {
    throw new Error('Tag not found');
  }

  const index = await createTagIndex(tag, []);
  if (index) {
    const result = await publishTagIndex(index);
  }
  return tag;
});
