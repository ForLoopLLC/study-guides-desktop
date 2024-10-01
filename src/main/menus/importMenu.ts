import { MenuItemConstructorOptions, BrowserWindow } from 'electron';
import { Channels, Routes } from '../../enums';

export const createImportMenu = (
  mainWindow: BrowserWindow,
): MenuItemConstructorOptions => ({
  label: 'Import',
  submenu: [
    {
      label: 'Colleges',
      click: () => {
        mainWindow.webContents.send(Channels.Navigate, Routes.Colleges);
      },
    },
    {
      label: 'Certifications',
      click: () => {
        mainWindow.webContents.send(Channels.Navigate, Routes.Certifications);
      },
    },
  ],
});
