import { MenuItemConstructorOptions, BrowserWindow } from 'electron';
import { prismaManager } from '../lib/database';

export const createConnectionsMenu = (
  mainWindow: BrowserWindow,
): MenuItemConstructorOptions => ({
  label: 'Connection',
  submenu: [
    {
      label: 'Development',
      click: () => {
        prismaManager.setPrismaClient('development');
        mainWindow.webContents.send('env-update', 'development');
      },
    },
    {
      label: 'Test',
      click: () => {
        prismaManager.setPrismaClient('test');
        mainWindow.webContents.send('env-update', 'test');

      },
    },
    {
      label: 'Production',
      click: () => {
        prismaManager.setPrismaClient('production');
        mainWindow.webContents.send('env-update', 'production');

      },
    },
  ],
});
