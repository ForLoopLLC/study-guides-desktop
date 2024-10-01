import { LogLevel } from '../../types';
import { Channels } from '../../enums';

const logMessage = async (
  level: LogLevel,
  category: string,
  message: string,
) => {
  await window.electron.ipcRenderer
    .invoke(Channels.LogMessage, level, category, message)
    .catch((error) => console.error('Logging error:', error)); // Ensure to catch errors
};

const logger = {
  info: (category: string, message: string) =>
    logMessage('info', category, message),
  warn: (category: string, message: string) =>
    logMessage('warn', category, message),
  error: (category: string, message: string) =>
    logMessage('error', category, message),
  debug: (category: string, message: string) =>
    logMessage('debug', category, message),
  verbose: (category: string, message: string) =>
    logMessage('verbose', category, message),
  silly: (category: string, message: string) =>
    logMessage('silly', category, message),
};

export default logger;
