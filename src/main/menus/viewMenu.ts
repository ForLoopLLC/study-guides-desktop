import { MenuItemConstructorOptions, BrowserWindow } from 'electron';

export const createViewMenu = (mainWindow: BrowserWindow, isDev: boolean): MenuItemConstructorOptions => ({
  label: '&View',
  submenu: isDev
    ? [
        {
          label: '&Reload',
          accelerator: 'Ctrl+R',
          click: () => {
            mainWindow.webContents.reload();
          },
        },
        {
          label: 'Toggle &Full Screen',
          accelerator: 'F11',
          click: () => {
            mainWindow.setFullScreen(!mainWindow.isFullScreen());
          },
        },
        {
          label: 'Toggle &Developer Tools',
          accelerator: 'Alt+Ctrl+I',
          click: () => {
            mainWindow.webContents.toggleDevTools();
          },
        },
      ]
    : [
        {
          label: 'Toggle &Full Screen',
          accelerator: 'F11',
          click: () => {
            mainWindow.setFullScreen(!mainWindow.isFullScreen());
          },
        },
      ],
});
