import { TagType } from '@prisma/client';
import { ParserType, ParserOperationMode } from '../../../enums';
import {
  Block,
  HeaderParser,
  ParserResult,
  CollegeHeader,
  CertificationHeader,
  QuestionAndAnswer,
} from '../../../types';

interface Chunk {
  header: string;
  data: string[];
}

const chunker = (lines: string[]): Chunk[] => {
  const chunks: Chunk[] = [];
  let currentChunk: Chunk | null = null;

  // Helper function to determine if a line is a list item (starts with 1., *, -)
  const isListItem = (line: string): boolean => {
    return /^\d+\.\s|[*-]\s/.test(line.trim());
  };

  for (let i = 1; i < lines.length; i++) {
    // Start at 1 to ignore the first line
    const line = lines[i].trim();

    if (!line) {
      continue; // Skip empty lines
    }

    if (!isListItem(line)) {
      // This is a header (non-list item)
      if (currentChunk) {
        chunks.push(currentChunk); // Push the previous chunk
      }
      currentChunk = { header: line, data: [] }; // Start a new chunk
    } else {
      // This is a list item
      if (currentChunk) {
        currentChunk.data.push(line); // Add list item to the current chunk
      }
    }
  }

  // Push the last chunk if it exists
  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
};

const bodyParser = (chunk: Chunk): QuestionAndAnswer[] => {
  const body = chunk.data;
  
  return body.map((line) => {
    // Regular expression to remove list item decorators (45. or * or -)
    const strippedLine = line.replace(/^\s*[\d*.-]+\s*/, '');

    // Split the question and answer on ' - ' and trim them
    const [question, answer] = strippedLine.split(' - ').map(part => part.trim());

    return {
      question: question || 'Unknown question', // Fallback in case of empty string
      answer: answer || 'Unknown answer', // Fallback in case of empty string
    };
  });
};

const collegeHeaderParser: HeaderParser = (header: string): CollegeHeader => {
  const items = header.split(':').map((item) => item.trim());
  if (items.length !== 6) {
    throw new Error(`Invalid College header format. Data: ${header}`);
  }
  const newHeader = {
    root: { name: items[0], type: TagType.Category },
    region: { name: items[1], type: TagType.Region },
    university: { name: items[2], type: TagType.University },
    department: { name: items[3], type: TagType.Department },
    course: { name: items[4], type: TagType.Course },
    topic: { name: items[5], type: TagType.Topic },
  };
  return newHeader;
};

const certificationHeaderParser: HeaderParser = (
  header: string,
): CertificationHeader => {
  const items = header.split(':').map((item) => item.trim());
  if (items.length !== 5) {
    throw new Error(`Invalid Certification header format. Data: ${header}`);
  }
  const newHeader = {
    root: { name: items[0], type: TagType.Category },
    organization: { name: items[1], type: TagType.Organization },
    certification: { name: items[2], type: TagType.Certification },
    module: { name: items[3], type: TagType.Module },
    topic: { name: items[4], type: TagType.Topic },
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
};

const preParse = (lines: string[], parserType: ParserType): ParserResult => {
  const headerParser = getHeaderParser(parserType);
  return rootParser(lines, headerParser);
};

const parse = (lines: string[], parserType: ParserType): ParserResult => {
  const headerParser = getHeaderParser(parserType);
  return rootParser(lines, headerParser);
};

const rootParser = (
  lines: string[],
  headerParser: HeaderParser,
): ParserResult => {
  const chunks: Chunk[] = chunker(lines);
  const blocks: Block[] = chunks.map((chunk) => ({
    header: headerParser(chunk.header),
    questions: bodyParser(chunk),
  }));
  return { chunks, blocks };
};

const fileParser = (
  file: string,
  parserType: ParserType,
  parserOperationMode: ParserOperationMode,
): ParserResult => {
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
};

export default fileParser;
