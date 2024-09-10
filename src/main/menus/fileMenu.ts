import { MenuItemConstructorOptions, BrowserWindow } from 'electron';

export const createFileMenu = (mainWindow: BrowserWindow): MenuItemConstructorOptions => ({
  label: '&File',
  submenu: [
    {
      label: '&Open',
      accelerator: 'Ctrl+O',
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
