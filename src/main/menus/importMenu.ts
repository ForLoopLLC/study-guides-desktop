import { MenuItemConstructorOptions, BrowserWindow } from 'electron';

export const createImportMenu = (
  mainWindow: BrowserWindow,
): MenuItemConstructorOptions => ({
  label: 'Import',
  submenu: [
    {
      label: 'Colleges',
      click: () => {
        mainWindow.webContents.send('navigate', '/colleges');
      },
    },
    {
      label: 'Certifications',
      click: () => {
        mainWindow.webContents.send('navigate', '/certifications');
      },
    },
  ],
});
