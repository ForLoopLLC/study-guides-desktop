import { MenuItemConstructorOptions, BrowserWindow } from 'electron';
import { Channels, Routes } from '../../enums';

export const createScreensMenu = (
  mainWindow: BrowserWindow,
): MenuItemConstructorOptions => ({
  label: 'Manage',
  submenu: [
    {
      label: 'Tags',
      click: () => {
        mainWindow.webContents.send(Channels.Navigate, Routes.Tags);
      },
    },
    {
      label: 'Questions',
      click: () => {
        mainWindow.webContents.send(Channels.Navigate, Routes.Questions);
      },
    },
    {
      label: 'Users',
      click: () => {
        mainWindow.webContents.send(Channels.Navigate, Routes.Users);
      },
    },
  ],
});
