import { MenuItemConstructorOptions, BrowserWindow } from 'electron';

export const createConnectionsMenu = (mainWindow: BrowserWindow): MenuItemConstructorOptions => ({
  label: 'Connection',
  submenu: [
    {
      label: 'Development',
      click: () => {
        mainWindow.webContents.send('connection', 'dev');
      },
    },
    {
      label: 'Test',
      click: () => {
        mainWindow.webContents.send('connection', 'test');
      },
    },
    {
      label: 'Production',
      click: () => {
        mainWindow.webContents.send('connection', 'prod');
      },
    },
  ],
});
