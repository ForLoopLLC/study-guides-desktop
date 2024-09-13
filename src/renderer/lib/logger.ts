import { ipcRenderer } from 'electron';
import { LogLevel} from '../../types';


const logMessage = (level: LogLevel, message: string) => {
  ipcRenderer.send('log-message', level, message);
};

const logger = {
  info: (message: string) => logMessage('info', message),
  warn: (message: string) => logMessage('warn', message),
  error: (message: string) => logMessage('error', message),
  debug: (message: string) => logMessage('debug', message),
  verbose: (message: string) => logMessage('verbose', message),
  silly: (message: string) => logMessage('silly', message),
};

export default logger;