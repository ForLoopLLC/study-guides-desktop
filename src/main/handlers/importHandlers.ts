import { app, ipcMain } from 'electron';
import fs from 'fs';
import path from 'path';
import { log } from '../main';
import {
  Feedback,
  FileListFeedback,
  DeleteFileFeedback,
  ImportFile,
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

  dirsToEnsure.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Handle file import to local directory
  ipcMain.handle('import-file-to-local', (event, { filePath, parserType }) => {
    try {
      const parser = parserType as ParserType;
      const fileName = path.basename(filePath);
      let destPath = '';

      switch (parser) {
        case ParserType.Colleges:
          destPath = path.join(tempCollegesDir, fileName);
          break;
        case ParserType.Certifications:
          destPath = path.join(tempCertificationsDir, fileName);
          break;
        default:
          throw new Error('Invalid parser type');
      }

      fs.copyFileSync(filePath, destPath);
      log.info('File imported to local directory:', destPath);
      const feedback: Feedback = {
        message: `Successfully imported file to local directory: ${destPath}`,
        success: true,
      };
      event.sender.send('file-import-feedback', feedback);
    } catch (error) {
      const err = error as Error;
      log.error('import', `File import error. ${err.message}`);
      const feedback: Feedback = {
        message: `An error occurred while importing the file. ${err.message}`,
        success: false,
      };
      event.sender.send('file-import-feedback', feedback);
    }
  });

  ipcMain.handle('import-list-files', (event, { parserType }) => {
    try {
      const parser = parserType as ParserType;
      let targetDir = '';

      switch (parser) {
        case ParserType.Colleges:
          targetDir = tempCollegesDir;
          break;
        case ParserType.Certifications:
          targetDir = tempCertificationsDir;
          break;
        default:
          throw new Error('Invalid parser type');
      }

      // Get list of files in the directory
      const files = fs.readdirSync(targetDir).map((file) => ({
        name: file,
        path: path.join(targetDir, file),
      })) as ImportFile[];

      console.log(files);

      const feedback: FileListFeedback = {
        files: files,
        message: 'Successfully listed files',
        success: true,
      };

      event.sender.send('file-list-feedback', feedback);
    } catch (error) {
      const err = error as Error;
      log.error('list', `Error listing files. ${err.message}`);
      const feedback: FileListFeedback = {
        files: [],
        message: `An error occurred while listing files. ${err.message}`,
        success: false,
      };
      event.sender.send('file-list-feedback', feedback);
    }
  });

  ipcMain.handle('import-delete-file', (event, { filePath }) => {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        log.info('File deleted:', filePath);
        const feedback: DeleteFileFeedback = {
          message: `Successfully deleted file: ${filePath}`,
          success: true,
          filePath: filePath,
        };
        event.sender.send('file-delete-feedback', feedback);
      } else {
        throw new Error('File does not exist');
      }
    } catch (error) {
      const err = error as Error;
      log.error('delete', `Error deleting file. ${err.message}`);
      const feedback: DeleteFileFeedback = {
        message: `An error occurred while deleting the file. ${err.message}`,
        success: false,
        filePath: filePath,
      };
      event.sender.send('file-delete-feedback', feedback);
    }
  });
});
