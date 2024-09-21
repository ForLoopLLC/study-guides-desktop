import { ipcMain } from 'electron';
import { log } from '../main';
import {
  getUsers,
  updateUser,
} from '../lib/database/users';
import { createTagIndex, deleteTagIndex } from '../lib/database/search';
import { publishUsersIndex, unpublishUsersIndex } from '../lib/search/users';

ipcMain.handle('get-users', async (_event, { page, limit, filter, query }) => {
  try {
    const users = await getUsers(page, limit, filter, query);
    return users;
  } catch (error) {
    const err = error as Error;
    log.error('users', `Error fetching users: ${err.message}.`);
    throw new Error('Failed to fetch users.');
  }
});