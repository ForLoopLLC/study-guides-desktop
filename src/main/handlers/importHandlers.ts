import { app, ipcMain } from 'electron';
import mammoth from 'mammoth';
import AdmZip from 'adm-zip';
import fs from 'fs';
import path from 'path';
import { log } from '../main';
import {
  Feedback,
  FileListFeedback,
  DeleteFileFeedback,
  DeleteFolderFeedback,
  ImportFile,
  RawTopic,
  ParserResult,
  PreParserFeedback,
  PreParserFolderFeedback,
  ParsedCertificationTopic,
  ParsedCollegeTopic
} from '../../types';
import { ParserType, ParserOperationMode } from '../../enums';
import { fileParser, toParsedTopic } from '../lib/parse';

const ignorelist = ['.DS_Store', 'Thumbs.db', 'parsed'];

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

  const listFilesRecursive = (
    dir: string,
    ignoreList: string[] = [],
  ): ImportFile[] => {
    const filesList: ImportFile[] = [];

    // Read the directory contents
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      if (ignoreList.includes(file)) {
        // Skip the file if it's in the ignore list
        return;
      }

      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        // If it's a directory, recursively list its contents
        const subDirFiles = listFilesRecursive(filePath, ignoreList);
        filesList.push(...subDirFiles);
      } else {
        // If it's a file, add it to the list
        filesList.push({
          name: file,
          path: filePath,
          directory: dir,
        });
      }
    });

    return filesList;
  };


  // Output results
  const outputResult = (topic: RawTopic[], parserType: ParserType): (ParsedCollegeTopic | ParsedCertificationTopic)[] => {
    return topic.map((topic) => toParsedTopic(topic, parserType));
  }

  const outputResults = (
    results: ParserResult[],
    parserType: ParserType,
    outputFolder: string,
  ) => {
    // Create the `parsed` folder inside the output folder
    const parsedFolder = path.join(outputFolder, 'parsed');
    ensureDirectoryExists(parsedFolder);
  
    // Iterate over each result and output each parsed topic to its own JSON file
    const parsedTopics: (ParsedCollegeTopic | ParsedCertificationTopic)[] = results
      .map((result) => outputResult(result.topics, parserType))
      .flat();
  
    parsedTopics.forEach((parsedTopic) => {
      const fileName = `${parsedTopic.hash}.json`; // Replace any invalid characters in the name
      const filePath = path.join(parsedFolder, fileName);
  
      // Write the JSON string to the file
      fs.writeFileSync(filePath, parsedTopic.toJson(), 'utf8');
      console.log(`Saved ${parsedTopic.name} to ${filePath}`);
    });
  };

  // Handle file import
  ipcMain.handle(
    'import-file-to-local',
    async (event, { filePath, parserType }) => {
      try {
        const parser = parserType as ParserType;

        // Extract file name and create the folder name based on the file name (without extension)
        const fileName = path.basename(filePath);
        const fileNameWithoutExt = path.parse(filePath).name; // Remove extension
        const workingDir = getWorkingDir(parser);

        if (path.extname(filePath) === '.zip') {
          // Handle ZIP files
          const zip = new AdmZip(filePath);
          const zipEntries = zip.getEntries(); // Get all entries in the ZIP file

          for (const zipEntry of zipEntries) {
            if (!zipEntry.isDirectory) {
              const entryPathParts = zipEntry.entryName.split(path.sep);
              const folderName =
                entryPathParts.length > 1
                  ? entryPathParts[0]
                  : fileNameWithoutExt; // Folder name from ZIP structure or fallback
              const extractedFileName = path.basename(zipEntry.entryName);
              const destFolder = path.join(workingDir, folderName);

              // Create the destination folder if it doesn't exist
              if (!fs.existsSync(destFolder)) {
                fs.mkdirSync(destFolder, { recursive: true });
              }

              const extractedFilePath = path.join(
                destFolder,
                extractedFileName,
              );
              const extractedFileExt = path.extname(extractedFileName);

              if (extractedFileExt === '.docx') {
                // Convert DOCX to text
                const result = await mammoth.extractRawText({
                  buffer: zipEntry.getData(),
                });
                const textContent = result.value;

                const textFilePath = path.join(
                  destFolder,
                  `${path.parse(extractedFileName).name}.txt`,
                );

                fs.writeFileSync(textFilePath, textContent, 'utf8');
                log.info(
                  'Converted and saved DOCX file to text format:',
                  textFilePath,
                );
              } else {
                // Extract other files (e.g., .txt)
                fs.writeFileSync(extractedFilePath, zipEntry.getData());
                log.info('File extracted:', extractedFilePath);
              }
            }
          }
        } else if (path.extname(filePath) === '.docx') {
          // Handle DOCX files
          const parentFolder = path.join(workingDir, fileNameWithoutExt);
          if (!fs.existsSync(parentFolder)) {
            fs.mkdirSync(parentFolder);
          }

          const result = await mammoth.extractRawText({ path: filePath });
          const textContent = result.value;

          const destPath = path.join(parentFolder, `${fileNameWithoutExt}.txt`);

          fs.writeFileSync(destPath, textContent, 'utf8');
          log.info('Converted and saved DOCX file to text format:', destPath);
        } else {
          // Handle other files
          const parentFolder = path.join(workingDir, fileNameWithoutExt);
          if (!fs.existsSync(parentFolder)) {
            fs.mkdirSync(parentFolder);
          }

          const destPath = path.join(parentFolder, fileName);
          fs.copyFileSync(filePath, destPath);
          log.info('File imported to local directory:', destPath);
        }

        // Send success feedback
        const feedback: Feedback = {
          message: `Imported file for processing.`,
          success: true,
          level: 'info',
          dateTime: new Date(),
        };
        event.sender.send('file-import-feedback', feedback);
      } catch (error) {
        const err = error as Error;
        log.error('import', `File import error. ${err.message}`);

        // Send error feedback
        const feedback: Feedback = {
          message: `Error importing the file. ${err.message}`,
          success: false,
          level: 'error',
          dateTime: new Date(),
        };
        event.sender.send('file-import-feedback', feedback);
      }
    },
  );

  // Handle file listing
  ipcMain.handle('import-list-files', (event, { parserType }) => {
    try {
      const targetDir = getWorkingDir(parserType);
      const files = listFilesRecursive(targetDir, ignorelist);

      const feedback: FileListFeedback = {
        files,
        message: 'Listed files',
        success: true,
        level: 'trace',
        dateTime: new Date(),
      };

      event.sender.send('file-list-feedback', feedback);
    } catch (error) {
      const err = error as Error;
      log.error('list', `Error listing files. ${err.message}`);
      const feedback: FileListFeedback = {
        files: [],
        message: `Error listing files. ${err.message}`,
        success: false,
        level: 'error',
        dateTime: new Date(),
      };
      event.sender.send('file-list-feedback', feedback);
    }
  });

  // Handle file deletion
  ipcMain.handle('import-delete-file', (event, { filePath }) => {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        log.info('File deleted:', filePath);
        const feedback: DeleteFileFeedback = {
          message: `Deleted file: ${path.basename(filePath)}`,
          success: true,
          filePath: filePath,
          level: 'info',
          dateTime: new Date(),
        };
        event.sender.send('file-delete-feedback', feedback);
      } else {
        throw new Error('File does not exist');
      }
    } catch (error) {
      const err = error as Error;
      log.error('delete', `Error deleting file. ${err.message}`);
      const feedback: DeleteFileFeedback = {
        message: `Error deleting the file. ${err.message}`,
        success: false,
        filePath: filePath,
        level: 'error',
        dateTime: new Date(),
      };
      event.sender.send('file-delete-feedback', feedback);
    }
  });

  // Handle file parsing
  ipcMain.handle(
    'import-parse-file',
    (event, { parserType, filePath, operationMode }) => {
      let result: any;
      try {
        const file = fs.readFileSync(filePath, 'utf-8');
        result = fileParser(file, filePath, parserType, operationMode);

        const folderPath = path.dirname(filePath);
        outputResults([result], parserType, folderPath);

        const feedback: PreParserFeedback = {
          message: `${operationMode as ParserOperationMode} succeeded: ${path.basename(filePath)}`,
          success: true,
          result: result,
          level: 'info',
          dateTime: new Date(),
        };
        log.info(
          'import',
          `File ${operationMode as ParserOperationMode} succeeded.`,
        );
        event.sender.send('file-parse-feedback', feedback);
      } catch (error) {
        const err = error as Error;
        const feedback: PreParserFeedback = {
          message: `Error running ${operationMode}\n\n${err.message}`,
          success: false,
          result: result,
          level: 'error',
          dateTime: new Date(),
        };
        event.sender.send('file-parse-feedback', feedback);
        log.error('import', `Error ${operationMode} file. ${err.message}`);
      }
    },
  );

  // Handle folder parsing
  ipcMain.handle(
    'import-parse-folder',
    (event, { parserType, folderName, operationMode }) => {
      const workingDir = getWorkingDir(parserType);
      const folderPath = path.join(workingDir, folderName);
      console.log('parse folder', folderPath);
      try {
        // Ensure the folder exists
        if (!fs.existsSync(folderPath)) {
          throw new Error('Folder does not exist');
        }

        // Recursively get all files in the folder
        const files = listFilesRecursive(folderPath, ignorelist);

        const results = files.map((file) => {
          const fileContent = fs.readFileSync(file.path, 'utf-8');
          return fileParser(fileContent, file.path, parserType, operationMode);
        });

        outputResults(results, parserType, folderPath);

        const feedback: PreParserFolderFeedback = {
          message: `${operationMode as ParserOperationMode} succeeded: ${folderName}`,
          success: true,
          results: results, // Return the results for each file
          level: 'info',
          dateTime: new Date(),
        };
        log.info(
          'import',
          `Folder ${operationMode as ParserOperationMode} succeeded.`,
        );
        event.sender.send('folder-parse-feedback', feedback);
      } catch (error) {
        const err = error as Error;
        const feedback: PreParserFolderFeedback = {
          message: `Error running ${operationMode}\n\n${err.message}`,
          success: false,
          results: [],
          level: 'error',
          dateTime: new Date(),
        };
        event.sender.send('folder-parse-feedback', feedback);
        log.error('import', `Error ${operationMode} folder. ${err.message}`);
      }
    },
  );

  // Handle folder deletion
  ipcMain.handle(
    'import-delete-folder',
    (event, { folderName, parserType }) => {
      const workingDir = getWorkingDir(parserType);
      const folderPath = path.join(workingDir, folderName);
      console.log('delete folder', folderPath);
      try {
        // Ensure the folder exists
        if (!fs.existsSync(folderPath)) {
          throw new Error('Folder does not exist');
        }

        // Recursively remove the folder and its contents
        fs.rmSync(folderPath, { recursive: true, force: true });

        // Send success feedback
        const feedback: DeleteFolderFeedback = {
          message: `Deleted folder: ${folderName}`,
          success: true,
          filePath: folderPath,
          level: 'info',
          dateTime: new Date(),
        };
        event.sender.send('folder-delete-feedback', feedback);
      } catch (error) {
        const err = error as Error;
        log.error('delete', `Error deleting folder. ${err.message}`);

        // Send error feedback
        const feedback: DeleteFolderFeedback = {
          message: `Error deleting the folder. ${err.message}`,
          success: false,
          filePath: folderPath,
          level: 'error',
          dateTime: new Date(),
        };
        event.sender.send('folder-delete-feedback', feedback);
      }
    },
  );
});
