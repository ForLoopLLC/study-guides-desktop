/* eslint import/prefer-default-export: off */
import { App } from 'electron';
import { URL } from 'url';
import path from 'path';
import crypto from "crypto";
import dotenv from 'dotenv';
import fs from 'fs';
import log from 'electron-log';


export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export function chunkArray<T>(array: T[], size: number): T[][] {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}



export const getHash = (input: string): string => {
  return crypto
    .createHash("sha256") // Create a SHA-256 hash object
    .update(input) // Update the hash with the input string
    .digest("hex"); // Calculate the digest as a hexadecimal string
};

export const loadEnvFile = (app: App) => {
  let filePath: string;

  if (app.isPackaged) {
    // Production mode: Use the appData folder
    filePath = path.join(app.getPath('userData'), '.env');
  } else {
    // Development mode: Use the project root or custom dev path
    filePath = path.join(__dirname, '../../.env');
  }

  // Check if the .env file exists before loading
  if (fs.existsSync(filePath)) {
    log.info(`Loading env file from ${filePath}.`);
    dotenv.config({ path: filePath });
  } else {
    log.error(`Env file not found at ${filePath}.`);
  }
};

export const setupLogger = (app: App) => {
  // Set the log file path
  log.transports.file.resolvePath = () =>
    path.join(app.getPath('userData'), 'logs', 'app.log');

  // Configure log levels based on environment
  if (process.env.NODE_ENV === 'development') {
    log.transports.console.level = 'debug';
    log.transports.file.level = 'debug';
  } else {
    log.transports.console.level = 'info';
    log.transports.file.level = 'info';
  }
  return log;
};


