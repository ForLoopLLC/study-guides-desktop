import { MenuItemConstructorOptions, BrowserWindow } from 'electron';

export const createScreensMenu = (
  mainWindow: BrowserWindow,
): MenuItemConstructorOptions => ({
  label: 'Screens',
  submenu: [
    {
      label: 'Home',
      click: () => {
        mainWindow.webContents.send('navigate', '/');
      },
    },
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
