import { TagType } from "@prisma/client";
import { ParserType, ParserOperationMode } from "../../../enums";
import { Chunk, Block, HeaderParser, ParserResult, CollegeHeader, CertificationHeader, QuestionAndAnswer } from "../../../types";

const chunker = (lines: string[]): Chunk[] => {
  // TODO: Implement chunker
  // This function should take an array of strings and return an array of chunks
  return [{ header: '', data: [] }];
}

const bodyParser = (chunk: Chunk): QuestionAndAnswer[] => {
  // TODO: Implement bodyParser
  // This function should take a chunk and return an array of QuestionAndAnswer objects derived from the chunk.data
  const body = chunk.data;
  return [
    { question: 'Question', answer: 'Answer' }
  ];
}

const collegeHeaderParser: HeaderParser = (header: string): CollegeHeader => {
  const items = header.split(',');
  if (items.length !== 4) {
    throw new Error(`Invalid College header format. Data: ${header}`);
  }
  const newHeader = {
    University: { name: items[0], type: TagType.University },
    Department: { name: items[1], type: TagType.Department },
    Course: { name: items[2], type: TagType.Course },
    Topic: { name: items[3], type: TagType.Topic },
  };
  return newHeader;
};

const certificationHeaderParser: HeaderParser = (header: string): CertificationHeader => {
  const items = header.split(',');
  if (items.length !== 4) {
    throw new Error(`Invalid Certification header format. Data: ${header}`);
  }
  const newHeader = {
    Organization: { name: items[0], type: TagType.Organization },
    Certification: { name: items[1], type: TagType.Certification },
    Module: { name: items[2], type: TagType.Module },
    Topic: { name: items[3], type: TagType.Topic },
  };
  return newHeader;
};

const getHeaderParser = (parserType: ParserType): HeaderParser => {
  switch (parserType) {
    case ParserType.Colleges:
      return collegeHeaderParser;
    case ParserType.Certifications:
      return certificationHeaderParser;
  }
}

const preParse = (lines: string[], parserType: ParserType): ParserResult => {
  const headerParser = getHeaderParser(parserType);
  return rootParser(lines, headerParser);
}

const parse = (lines: string[], parserType: ParserType): ParserResult => {
  const headerParser = getHeaderParser(parserType);
  return rootParser(lines, headerParser);
}

const rootParser = (lines: string[], headerParser: HeaderParser): ParserResult => {
  const chunks: Chunk[] = chunker(lines);
  const blocks: Block[] = chunks.map(chunk => ({header: headerParser(chunk.header), questions: bodyParser(chunk)}));
  return { chunks, blocks };
}

const fileParser = (file: string, parserType: ParserType, parserOperationMode: ParserOperationMode): ParserResult => {
  const lines = file.split('\n');
  try {
    switch (parserOperationMode) {
      case ParserOperationMode.PreParse:
        return preParse(lines, parserType);
      case ParserOperationMode.Parse:
        return parse(lines, parserType);
    }
  } catch (error) {
    throw error;
  }
}

export default fileParser;