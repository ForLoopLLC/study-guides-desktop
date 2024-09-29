import { app, ipcMain } from 'electron';
import fs from 'fs';
import path from 'path';
import { log } from '../main';
import {
  Feedback,
  FileListFeedback,
  DeleteFileFeedback,
  ImportFile,
  PreParserFeedback
} from '../../types';
import { ParserType } from '../../enums';
import { fileParser } from '../lib/parsers';

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

  const listFilesRecursive = (dir: string): ImportFile[] => {
    const filesList: ImportFile[] = [];
  
    // Read the directory contents
    const files = fs.readdirSync(dir);
  
    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
  
      if (stat.isDirectory()) {
        // If it's a directory, recursively list its contents
        const subDirFiles = listFilesRecursive(filePath);
        filesList.push(...subDirFiles);
      } else {
        // If it's a file, add it to the list
        filesList.push({
          name: file,
          path: filePath,
          directory: dir
        });
      }
    });
  
    return filesList;
  };
  

  // Handle file import to local directory
  ipcMain.handle('import-file-to-local', (event, { filePath, parserType }) => {
    try {
      const parser = parserType as ParserType;
      
      // Extract file name and create the folder name based on the file name (without extension)
      const fileName = path.basename(filePath);
      const fileNameWithoutExt = path.parse(filePath).name; // Remove extension
      const workingDir = getWorkingDir(parser);
      
      // Create the parent folder with the same name as the file (without extension)
      const parentFolder = path.join(workingDir, fileNameWithoutExt);
      if (!fs.existsSync(parentFolder)) {
        fs.mkdirSync(parentFolder);
      }
  
      // Define destination path within the new folder
      const destPath = path.join(parentFolder, fileName);
  
      // Copy file to the new folder
      fs.copyFileSync(filePath, destPath);
      log.info('File imported to local directory:', destPath);
  
      // Send success feedback
      const feedback: Feedback = {
        message: `Successfully imported file to local directory: ${destPath}`,
        success: true,
      };
      event.sender.send('file-import-feedback', feedback);
  
    } catch (error) {
      const err = error as Error;
      log.error('import', `File import error. ${err.message}`);
      
      // Send error feedback
      const feedback: Feedback = {
        message: `An error occurred while importing the file. ${err.message}`,
        success: false,
      };
      event.sender.send('file-import-feedback', feedback);
    }
  });


  ipcMain.handle('import-list-files', (event, { parserType }) => {
    try {
      const targetDir = getWorkingDir(parserType);
  
      // Recursively get list of files in the directory and subdirectories
      const files = listFilesRecursive(targetDir);
  
      const feedback: FileListFeedback = {
        files,
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

  ipcMain.handle('import-parse-file', (event, { parserType, filePath, operationMode }) => {
    let result: any;
    try {
      const file = fs.readFileSync(filePath, 'utf-8');
      result = fileParser(file, parserType, operationMode);
      const feedback: PreParserFeedback = {
        message: `Successfully ${operationMode} file`,
        success: true,
        result: result,
      };
      log.info('import', `Successfully ${operationMode} file`);
      event.sender.send('file-parse-feedback', feedback);
    } catch (error) {
      const err = error as Error;
      const feedback: PreParserFeedback = {
        message: `An error occurred while ${operationMode} the file. ${err.message}`,
        success: false,
        result: result,
      };
      event.sender.send('file-parse-feedback', feedback);
      log.error('import', `Error ${operationMode} file. ${err.message}`);
    }
  });
});
