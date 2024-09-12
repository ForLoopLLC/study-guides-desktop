import { MenuItemConstructorOptions, BrowserWindow } from 'electron';

export const createEditMenu = (
  mainWindow: BrowserWindow,
): MenuItemConstructorOptions => ({
  label: 'Edit',
  submenu: [{ role: 'copy' }, { role: 'cut' }, { role: 'paste' }],
});
