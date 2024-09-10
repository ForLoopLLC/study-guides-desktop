import { MenuItemConstructorOptions, BrowserWindow } from 'electron';

export const createDatabaseMenu = (mainWindow: BrowserWindow): MenuItemConstructorOptions => ({
  label: 'Database',
  submenu: [
    {
      label: 'Tags',
      click: () => {
        mainWindow.webContents.send('navigate', '/tags');
      },
    },
    {
      label: 'Questions',
      click: () => {
        mainWindow.webContents.send('navigate', '/questions');
      },
    },
    {
      label: 'Users',
      click: () => {
        mainWindow.webContents.send('navigate', '/users');
      },
    },
  ],
});
