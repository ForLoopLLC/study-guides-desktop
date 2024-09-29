import { TagType } from '@prisma/client';

export interface QuestionAndAnswer {
  question: string;
  answer: string;
  hash: string;
  parentHash: string;
}

export interface HeaderSection {
  name: string;
  type: TagType;
  hash: string;
}

export interface Header {
  root: HeaderSection;
  topic: HeaderSection;
}

export interface CollegeHeader extends Header {
  region: HeaderSection;
  university: HeaderSection;
  department: HeaderSection;
  course: HeaderSection;
}

export interface CertificationHeader extends Header {
  organization: HeaderSection;
  certification: HeaderSection;
  module: HeaderSection;
}

export interface Chunk {
  header: string;
  data: string[];
}

export interface Block {
  header?: CollegeHeader | CertificationHeader;
  questions?: QuestionAndAnswer[];
}

export interface ParserResult {
  chunks: Chunk[];
  blocks?: Block[];
}

export interface Feedback {
  message: string;
  success: boolean;
}

export interface ImportFile {
  name: string;
  path: string;
  directory: string;
}

export interface FileListFeedback extends Feedback {
  files: ImportFile[];
}

export interface DeleteFileFeedback extends Feedback {
  filePath: string;
}

export interface PreParserFeedback extends Feedback {
  result: ParserResult;
}

export interface DeleteFolderFeedback extends Feedback {
  filePaths: string[];
}

export interface PreParserFolderFeedback extends Feedback {
  results: ParserResult[];
}

export type HeaderParser = (
  header: string,
) => CollegeHeader | CertificationHeader;
