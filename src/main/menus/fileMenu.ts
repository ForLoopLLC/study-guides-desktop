import { MenuItemConstructorOptions, BrowserWindow } from 'electron';

export const createFileMenu = (
  mainWindow: BrowserWindow,
): MenuItemConstructorOptions => ({
  label: '&File',
  submenu: [
    {
      label: 'Home',
      click: () => {
        mainWindow.webContents.send('navigate', '/');
      },
    },
    {
      label: '&Close',
      accelerator: 'Ctrl+W',
      click: () => {
        mainWindow.close();
      },
    },
  ],
});
