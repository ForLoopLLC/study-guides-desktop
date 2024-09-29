import { TagType } from '@prisma/client';

export interface QuestionAndAnswer {
  question: string;
  answer: string;
}

export interface HeaderSection {
  name: string;
  type: TagType;
}

export interface Header {
  root: HeaderSection;
}

export interface CollegeHeader extends Header {
  region: HeaderSection;
  university: HeaderSection;
  department: HeaderSection;
  course: HeaderSection;
  topic: HeaderSection;
}

export interface CertificationHeader extends Header {
  organization: HeaderSection;
  certification: HeaderSection;
  module: HeaderSection;
  topic: HeaderSection;
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

export type HeaderParser = (
  header: string,
) => CollegeHeader | CertificationHeader;
