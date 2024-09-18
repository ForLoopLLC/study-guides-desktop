import { ipcMain, app, BrowserWindow } from 'electron';
import { log } from '../main';
import { LogLevel } from '../../types';
import { tailLogFile, stopTailLogFile } from '../util';


ipcMain.handle('log-message', (_event, level: string, category: string, message: string) => {
  if (['info', 'warn', 'error', 'debug', 'verbose', 'silly'].includes(level)) {
    (log as any)[level as LogLevel](category, message);
  } else {
    log.error('general',`Invalid log level: ${level}`);
  }
});

ipcMain.handle('start-tail-log', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (window) {
    tailLogFile(app, window);
  } else {
    log.error('general', 'Failed to get BrowserWindow instance.');
  }
});

ipcMain.handle('stop-tail-log', () => {
  stopTailLogFile();
});



