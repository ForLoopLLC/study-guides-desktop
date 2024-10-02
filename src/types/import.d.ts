import { TagType } from '@prisma/client';
import { ContentRatingType } from '@prisma/client';
import { Feedback } from '.';

export interface Chunk {
  header: string;
  data: string[];
}

export interface RawQuestion {
  question: string;
  answer: string;
  hash: string;
  parentHash: string;
}
export interface RawTopic {
  header: CollegeHeader | CertificationHeader;
  questions: RawQuestion[];
  filePath: string;
}

//output types from the parser
export interface ParsedQuestion extends RawQuestion {
  metaTags: string[];
  distractors: string[];
  learnMore: string;
}

export interface ParsedTag {
  name: string;
  type: TagType;
  hash: string;
  contentRating: ContentRatingType;
  contentDescriptors: string[];
  metaTags: string[];
}

export interface ParsedTopic extends ParsedTag {
  parent: ParsedTag;
  questions: ParsedQuestion[];
}

export interface ParsedCollegeTopic extends ParsedTopic {
  region: ParsedTag;
  university: ParsedTag;
  department: ParsedTag;
  course: ParsedTag;
  toJson: () => string;
}

export interface ParsedCertificationTopic extends ParsedTopic {
  organization: ParsedTag;
  certification: ParsedTag;
  module: ParsedTag;
  toJson: () => string;
}

//types for the parser
export interface ParserResult {
  chunks: Chunk[];
  topics: RawTopic[];
}

export interface ImportFile {
  name: string;
  path: string;
  directory: string;
}

// Types for the headers
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

export type HeaderParser = (
  header: string,
  filePath: string,
) => CollegeHeader | CertificationHeader;

// Types for feedback

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
  filePath: string;
}

export interface PreParserFolderFeedback extends Feedback {
  results: ParserResult[];
}

export interface AssistFolderFeedback extends Feedback {}

export interface AssistFolderProgress {
  topicProgress: {
    message: string;
    processed: number;
    total: number;
    tps: number;
  };
  questionProgress: {
    message: string;
    processed: number;
    total: number;
    qps: number;
  };
}
