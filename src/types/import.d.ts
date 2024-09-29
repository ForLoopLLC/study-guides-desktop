import { TagType } from '@prisma/client';

export interface QuestionAndAnswer {
  question: string;
  answer: string;
}

export interface HeaderSection { name: string; type: TagType }

export interface CollegeHeader {
  University: HeaderSection;
  Department: HeaderSection;
  Course: HeaderSection;
  Topic: HeaderSection;
}

export interface CertificationHeader {
  Organization: HeaderSection;
  Certification: HeaderSection;
  Module: HeaderSection;
  Topic: HeaderSection;
}

export interface Chunk {
  header: string;
  data: string[];
}

export interface Block {
  headers?: CollegeHeader | CertificationHeader;
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

export type HeaderParser = (header: string) => CollegeHeader | CertificationHeader;
