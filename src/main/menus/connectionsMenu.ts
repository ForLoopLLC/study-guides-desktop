import { MenuItemConstructorOptions, BrowserWindow } from 'electron';
import { environmentManager } from '../lib/environment';
import { Channels } from '../../enums';

export const createConnectionsMenu = (
  mainWindow: BrowserWindow,
): MenuItemConstructorOptions => ({
  label: 'Connection',
  submenu: [
    {
      label: 'Development',
      click: () => {
        environmentManager.setEnvironment('development');
        mainWindow.webContents.send(
          Channels.EnvUpdate,
          environmentManager.getEnvironment(),
        );
      },
    },
    {
      label: 'Test',
      click: () => {
        environmentManager.setEnvironment('test');
        mainWindow.webContents.send(
          Channels.EnvUpdate,
          environmentManager.getEnvironment(),
        );
      },
    },
    {
      label: 'Production',
      click: () => {
        environmentManager.setEnvironment('production');
        mainWindow.webContents.send(
          Channels.EnvUpdate,
          environmentManager.getEnvironment(),
        );
      },
    },
  ],
});
