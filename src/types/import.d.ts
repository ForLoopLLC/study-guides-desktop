export interface Feedback {
  message: string;
  success: boolean;
}

export interface ImportFile {
  name: string;
  path: string;
}

export interface FileListFeedback extends Feedback {
  files: ImportFile[];
}

export interface DeleteFileFeedback extends Feedback {
    filePath: string;
}
