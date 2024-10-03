import { app, ipcMain } from 'electron';
import fs from 'fs';
import path from 'path';
import { log } from '../main';
import { Channels } from '../../enums';
import { logAndSend } from '../util';
import { exportTopics } from '../lib/export';
import {
  ParsedCertificationTopic,
  ParsedCollegeTopic,
  ExportFolderFeedback,
  ExportFolderProgress,
  ExportFolderComplete,
  FolderListFeedback,
} from '../../types';
import { ParserType } from '../../enums';

app.whenReady().then(() => {
  const tempCollegesDir = path.join(
    app.getPath('userData'),
    'uploads',
    'colleges',
  );
  const tempCertificationsDir = path.join(
    app.getPath('userData'),
    'uploads',
    'certifications',
  );

  const dirsToEnsure = [tempCollegesDir, tempCertificationsDir];

  const ensureDirectoryExists = (directory: string) => {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
  };

  dirsToEnsure.map(ensureDirectoryExists);

  // helpers
  const getWorkingDir = (parserType: ParserType) => {
    let destPath = '';
    switch (parserType) {
      case ParserType.Colleges:
        destPath = tempCollegesDir;
        break;
      case ParserType.Certifications:
        destPath = tempCertificationsDir;
        break;
      default:
        throw new Error('Invalid parser type');
    }
    return destPath;
  };

  const listFolders = (dir: string, ignoreList: string[] = []): string[] => {
    const folderList: string[] = [];

    // Read the directory contents
    const contents = fs.readdirSync(dir);

    contents.forEach((entry) => {
      if (ignoreList.includes(entry)) {
        // Skip the entry if it's in the ignore list
        return;
      }

      const entryPath = path.join(dir, entry);
      const stat = fs.statSync(entryPath);

      if (stat.isDirectory()) {
        // If it's a directory, add it to the list
        folderList.push(entryPath);
      }
    });

    return folderList;
  };

  ipcMain.handle(
    Channels.ExportFolder,
    async (event, { folderName, parserType }) => {
      try {
        const workingDir = getWorkingDir(parserType);
        const folderPath = path.join(workingDir, folderName, 'parsed');
        ensureDirectoryExists(folderPath);

        const files = fs
          .readdirSync(folderPath)
          .filter((file) => file.endsWith('.json'));

        const parseTopicFromFile = (filePath: string) => {
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          const parsedTopic = JSON.parse(fileContent);
          if (parserType === ParserType.Colleges) {
            return parsedTopic as ParsedCollegeTopic;
          } else if (parserType === ParserType.Certifications) {
            return parsedTopic as ParsedCertificationTopic;
          } else {
            throw new Error('Invalid parser type');
          }
        };

        let topics: (ParsedCollegeTopic | ParsedCertificationTopic)[] =
          files.map((file) => {
            const filePath = path.join(folderPath, file);
            return parseTopicFromFile(filePath);
          });

        const sharedEtlCounter = {
          current: 0,
          total: 0,
        };

        await exportTopics(
          topics,
          ({ message, processed, total }) => {
            const feedback: ExportFolderProgress = {
              message,
              processed,
              total,
              success: true,
              level: 'info',
              dateTime: new Date(),
            };
            logAndSend(event, Channels.ExportFolderProgress, feedback);
          },
          sharedEtlCounter,
        );

        const feedback: ExportFolderComplete = {
          message: `Exported folder: ${folderName}`,
          success: true,
          level: 'info',
          dateTime: new Date(),
        };

        logAndSend(event, Channels.ExportFolderFeedback, feedback);
      } catch (error) {
        const err = error as Error;

        const feedback: ExportFolderFeedback = {
          message: `Failed to export folder: ${folderName}`,
          success: false,
          level: 'info',
          dateTime: new Date(),
        };

        logAndSend(event, Channels.ExportFolderFeedback, feedback);
        throw new Error(`Failed to export folder.${err.message}`);
      }
    },
  );

  ipcMain.handle(Channels.ListFolders, async (event, { parserType }) => {
    try {
      const ignorelist: string[] = [];
      const targetDir = getWorkingDir(parserType);
      const folders = listFolders(targetDir, ignorelist);

      const feedback: FolderListFeedback = {
        folders,
        message: 'Listed files',
        success: true,
        level: 'trace',
        dateTime: new Date(),
      };

      logAndSend(event, Channels.ListFoldersFeedback, feedback);
    } catch (error) {
      const err = error as Error;
      const feedback: FolderListFeedback = {
        folders: [],
        message: `Error listing files. ${err.message}`,
        success: false,
        level: 'error',
        dateTime: new Date(),
      };
      logAndSend(event, Channels.ListFilesFeedback, feedback);
    }
  });
});
