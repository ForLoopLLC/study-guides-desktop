import { MenuItemConstructorOptions, BrowserWindow } from 'electron';
import { Channels, Routes } from '../../enums';

export const createFileMenu = (
  mainWindow: BrowserWindow,
): MenuItemConstructorOptions => ({
  label: '&File',
  submenu: [
    {
      label: 'Home',
      click: () => {
        mainWindow.webContents.send(Channels.Navigate, Routes.Root);
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
