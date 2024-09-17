import { ipcMain } from 'electron';
import { log } from '../main';
import { LogLevel } from '../../types';

ipcMain.handle('log-message', (_event, level: string, category: string, message: string) => {
  if (['info', 'warn', 'error', 'debug', 'verbose', 'silly'].includes(level)) {
    (log as any)[level as LogLevel](category, message);
  } else {
    log.error('general',`Invalid log level: ${level}`);
  }
});
