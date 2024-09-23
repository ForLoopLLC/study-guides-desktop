import { ipcMain } from 'electron';
import { log } from '../main';
import {
  getUsers,
  updateUser,
} from '../lib/database/users';
import { createUserIndex } from '../lib/database/search';
import { publishUsersIndex } from '../lib/search/users';

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

ipcMain.handle('update-user', async (_event, updatedUser) => {
  try {
    const user = await updateUser(updatedUser);
    if (!user) {
      throw new Error('User not found');
    }
    const index = await createUserIndex(user);
    if (index) {
      await publishUsersIndex([index]);
    }
    log.info('user', `${user.name} was updated the index was publish.`);
    return user;
  } catch (error) {
    const err = error as Error;
    log.error('user', `Error updating user: ${err.message}.`);
    throw new Error('Failed to update user.');
  }
});