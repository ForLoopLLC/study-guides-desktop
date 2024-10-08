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
  PreParserFolderFeedback,
  AssistFolderFeedback,
  ParsedCertificationTopic,
  ParsedCollegeTopic,
  ParsedQuestion,
} from '../../types';
import { ParserType, Channels } from '../../enums';
import { fileParser, toParsedTopic } from '../lib/parse';
import { getParsedTopicAssist } from '../lib/ai/parse';
import { logAndSend } from '../util';

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
  const outputParserResult = (
    topic: RawTopic[],
    parserType: ParserType,
  ): (ParsedCollegeTopic | ParsedCertificationTopic)[] => {
    return topic.map((topic) => toParsedTopic(topic, parserType));
  };

  const outputParserResults = (
    results: ParserResult[],
    parserType: ParserType,
    outputFolder: string,
  ) => {
    // Create the `parsed` folder inside the output folder
    const parsedFolder = path.join(outputFolder, 'parsed');
    ensureDirectoryExists(parsedFolder);

    // Iterate over each result and output each parsed topic to its own JSON file
    const parsedTopics: (ParsedCollegeTopic | ParsedCertificationTopic)[] =
      results
        .map((result) => outputParserResult(result.topics, parserType))
        .flat();

    parsedTopics.forEach((parsedTopic) => {
      const fileName = `${parsedTopic.hash}.json`; // Replace any invalid characters in the name
      const filePath = path.join(parsedFolder, fileName);

      // Write the JSON string to the file
      fs.writeFileSync(filePath, parsedTopic.toJson(), 'utf8');
    });
  };

  const outputAssistResults = (
    topics: (ParsedCollegeTopic | ParsedCertificationTopic)[],
    outputFolder: string,
  ) => {
    // Create the `parsed` folder inside the output folder
    const parsedFolder = path.join(outputFolder);
    ensureDirectoryExists(parsedFolder);

    topics.forEach((topic) => {
      const fileName = `${topic.hash}.json`; // Replace any invalid characters in the name
      const filePath = path.join(parsedFolder, fileName);

      // Write the JSON string to the file
      fs.writeFileSync(filePath, topic.toJson(), 'utf8');
    });
  };

  const processAIAssist = async <
    T extends ParsedCertificationTopic | ParsedCollegeTopic,
  >({
    topics,
    onProgress,
    totalRecords, // Optional if passed as an argument
  }: {
    topics: T[];
    onProgress: (data: {
      topicProgress: {
        message: string;
        processed: number;
        total: number;
      };
      questionProgress: {
        message: string;
        processed: number;
        total: number;
      };
    }) => void;
    totalRecords?: number;
  }) => {
    const totalTopics = totalRecords ?? topics.length;
    let processedTopics = 0;

    // Calculate total questions across all topics
    const totalQuestionsAcrossTopics = topics.reduce(
      (sum, topic) => sum + topic.questions.length,
      0,
    );

    // Shared counter for tracking question progress
    const sharedQuestionCounter = {
      current: 0,
      total: totalQuestionsAcrossTopics,
    };

    const results = [];

    for (const topic of topics) {
      const updatedTopic = await getParsedTopicAssist(
        topic,
        ({ message, processed, total }) => {
          onProgress({
            topicProgress: {
              message: `Processing questions for: ${topic.name}`,
              processed: processedTopics + 1, // Topic progress
              total: totalTopics,
            },
            questionProgress: {
              message,
              processed,
              total,
            },
          });
        },
        sharedQuestionCounter, // Pass the shared question counter
      );

      processedTopics += 1;

      // Send final topic progress
      onProgress({
        topicProgress: {
          message: `Processed: ${topic.name}`,
          processed: processedTopics,
          total: totalTopics,
        },
        questionProgress: {
          message: `Completed all questions for: ${topic.name}`,
          processed: sharedQuestionCounter.current, // Use shared counter
          total: sharedQuestionCounter.total, // Total questions across all topics
        },
      });

      results.push(updatedTopic);
    }

    return results;
  };

  // Handle file import
  ipcMain.handle(
    Channels.ImportFile,
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
        logAndSend(event, Channels.ImportFeedback, feedback);
      } catch (error) {
        const err = error as Error;

        // Send error feedback
        const feedback: Feedback = {
          message: `Error importing the file. ${err.message}`,
          success: false,
          level: 'error',
          dateTime: new Date(),
        };
        logAndSend(event, Channels.ImportFeedback, feedback);
      }
    },
  );

  // Handle file listing
  ipcMain.handle(Channels.ListFiles, (event, { parserType }) => {
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

      logAndSend(event, Channels.ListFilesFeedback, feedback);
    } catch (error) {
      const err = error as Error;
      const feedback: FileListFeedback = {
        files: [],
        message: `Error listing files. ${err.message}`,
        success: false,
        level: 'error',
        dateTime: new Date(),
      };
      logAndSend(event, Channels.ListFilesFeedback, feedback);
    }
  });

  // Handle file deletion
  ipcMain.handle(Channels.DeleteFile, (event, { filePath }) => {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        const feedback: DeleteFileFeedback = {
          message: `Deleted file: ${path.basename(filePath)}`,
          success: true,
          filePath: filePath,
          level: 'info',
          dateTime: new Date(),
        };
        logAndSend(event, Channels.DeleteFileFeedback, feedback);
      } else {
        throw new Error('File does not exist');
      }
    } catch (error) {
      const err = error as Error;
      const feedback: DeleteFileFeedback = {
        message: `Error deleting the file. ${err.message}`,
        success: false,
        filePath: filePath,
        level: 'error',
        dateTime: new Date(),
      };
      logAndSend(event, Channels.DeleteFileFeedback, feedback);
    }
  });

  // Handle folder parsing
  ipcMain.handle(Channels.ParseFolder, (event, { parserType, folderName }) => {
    const workingDir = getWorkingDir(parserType);
    const folderPath = path.join(workingDir, folderName);
    try {
      // Ensure the folder exists
      if (!fs.existsSync(folderPath)) {
        throw new Error('Folder does not exist');
      }

      // Recursively get all files in the folder
      const files = listFilesRecursive(folderPath, ignorelist);

      const results = files.map((file) => {
        const fileContent = fs.readFileSync(file.path, 'utf-8');
        return fileParser(fileContent, file.path, parserType);
      });

      outputParserResults(results, parserType, folderPath);

      const feedback: PreParserFolderFeedback = {
        message: `Preparse succeeded: ${folderName}`,
        success: true,
        results: results, // Return the results for each file
        level: 'info',
        dateTime: new Date(),
      };
      logAndSend(event, Channels.ParseFolderFeedback, feedback);
    } catch (error) {
      const err = error as Error;
      const feedback: PreParserFolderFeedback = {
        message: `Error running preparse\n\n${err.message}`,
        success: false,
        results: [],
        level: 'error',
        dateTime: new Date(),
      };
      logAndSend(event, Channels.ParseFolderFeedback, feedback);
    }
  });

  // Handle folder deletion
  ipcMain.handle(Channels.DeleteFolder, (event, { folderName, parserType }) => {
    const workingDir = getWorkingDir(parserType);
    const folderPath = path.join(workingDir, folderName);
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
      logAndSend(event, Channels.DeleteFolderFeedback, feedback);
    } catch (error) {
      const err = error as Error;

      // Send error feedback
      const feedback: DeleteFolderFeedback = {
        message: `Error deleting the folder. ${err.message}`,
        success: false,
        filePath: folderPath,
        level: 'error',
        dateTime: new Date(),
      };
      logAndSend(event, Channels.DeleteFolderFeedback, feedback);
    }
  });

  // Handle AI updates
  ipcMain.handle(
    Channels.AssistFolder,
    async (event, { parserType, folderName }) => {
      try {
        const workingDir = getWorkingDir(parserType);
        const folderPath = path.join(workingDir, folderName, 'parsed');
        let topicsLength = 0;

        // Get all the .json files in the folderPath
        const files = fs
          .readdirSync(folderPath)
          .filter((file) => file.endsWith('.json'));


        // Function to read and parse JSON files based on the parserType
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

        // Hydrate topics based on the parserType
        let topics: (ParsedCollegeTopic | ParsedCertificationTopic)[] =
          files.map((file) => {
            const filePath = path.join(folderPath, file);
            return parseTopicFromFile(filePath);
          });

        // Process the topics with AI Assist
        let results;
        switch (parserType) {
          case ParserType.Colleges:
            results = await processAIAssist({
              topics: topics as ParsedCollegeTopic[],
              onProgress: ({ topicProgress, questionProgress }) => {
                // Send progress update to the renderer
                logAndSend(event, Channels.AssistProgress, {
                  topicProgress,
                  questionProgress,
                });
              },
            });
            break;
          case ParserType.Certifications:
            results = await processAIAssist({
              topics: topics as ParsedCertificationTopic[],
              onProgress: ({ topicProgress, questionProgress }) => {
                // Send progress update to the renderer
                logAndSend(event, Channels.AssistProgress, {
                  topicProgress,
                  questionProgress,
                });
              },
            });
            break;
          default:
            throw new Error('Invalid parser type');
        }

        // Output the assist results
        topicsLength = results.length;
        outputAssistResults(results, folderPath);

        const feedback: AssistFolderFeedback = {
          message: `AI assist succeeded: ${folderName}`,
          success: true,
          level: 'info',
          dateTime: new Date(),
        };
        logAndSend(event, Channels.AssistFeedback, feedback);
      } catch (error) {
        const err = error as Error;
        const feedback: AssistFolderFeedback = {
          message: `Error running AI assist\n\n${err.message}`,
          success: false,
          level: 'error',
          dateTime: new Date(),
        };
        logAndSend(event, Channels.AssistFeedback, feedback);
      }
    },
  );
});
