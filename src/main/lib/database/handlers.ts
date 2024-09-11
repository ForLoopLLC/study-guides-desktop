
import { ipcMain } from 'electron';
import { getTags, updateTag } from './tags';

ipcMain.handle('get-tags', async (_event, { page, limit, filter }) => {
  return await getTags(page, limit, filter);
});

ipcMain.handle('update-tag', async (_event, updatedTag) => {
    return await updateTag(updatedTag);
  });