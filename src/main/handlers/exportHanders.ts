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
  ExportFeedback,
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

  ipcMain.handle(Channels.ExportFile, async (event, filePath) => {
    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const parsedTopic: ParsedCollegeTopic | ParsedCertificationTopic =
        JSON.parse(fileContent);
      await exportTopics([parsedTopic]);

      const feedback: ExportFeedback = {
        message: `Exported file: ${filePath}`,
        success: true,
        level: 'info',
        dateTime: new Date(),
      };

      logAndSend(event, Channels.ExportFileComplete, feedback);
    } catch (error) {
      const err = error as Error;
      logAndSend(event, Channels.ExportFileError, { message: err.message });
      throw new Error('Failed to export file.');
    }
  });
  ipcMain.handle(
    Channels.ExportFolder,
    async (event, { folderName, parserType }) => {
      try {
        const workingDir = getWorkingDir(parserType);
        const folderPath = path.join(workingDir, folderName, 'parsed');

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

        await exportTopics(topics);

        const feedback: ExportFeedback = {
          message: `Exported folder: ${folderName}`,
          success: true,
          level: 'info',
          dateTime: new Date(),
        };

        logAndSend(event, Channels.ExportFileComplete, feedback);
      } catch (error) {
        const err = error as Error;
        logAndSend(event, Channels.ExportFileError, { message: err.message });
        throw new Error('Failed to export folder.');
      }
    },
  );
});
