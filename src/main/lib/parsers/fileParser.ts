import { TagType } from '@prisma/client';
import { ParserType, ParserOperationMode } from '../../../enums';
import {
  Block,
  HeaderParser,
  ParserResult,
  CollegeHeader,
  CertificationHeader,
  QuestionAndAnswer,
  Header,
} from '../../../types';
import { getHash } from '../../util';

interface Chunk {
  filePath: string;
  header: string;
  data: string[];
}

const wrappedHeader = (header: string): string =>
  header
    .split(':')
    .map((item) => `[${item}]`)
    .join(',');

const chunker = (lines: string[], filePath: string): Chunk[] => {
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
      currentChunk = { header: line, data: [], filePath }; // Start a new chunk
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

const bodyParser = (chunk: Chunk, header: Header): QuestionAndAnswer[] => {
  const body = chunk.data;

  return body.map((line) => {
    // Regular expression to remove list item decorators (45. or * or -)
    const strippedLine = line.replace(/^\s*[\d*.-]+\s*/, '');

    // Split the question and answer on ' - ' and trim them
    const [question, answer] = strippedLine
      .split(' - ')
      .map((part) => part.trim());

    return {
      question: question || 'Unknown question', // Fallback in case of empty string
      answer: answer || 'Unknown answer', // Fallback in case of empty string
      hash: getHash(question + answer),
      parentHash: header.topic.hash,
    };
  });
};

const collegeHeaderParser: HeaderParser = (header: string): CollegeHeader => {
  const requiredItems = 6;
  const items = header.split(':').map((item) => item.trim());
  if (items.length !== requiredItems) {
    throw new Error(
      `Invalid College header format. ${requiredItems} items required. Found ${items.length}. ${wrappedHeader(header)}`,
    );
  }
  const newHeader = {
    root: { name: items[0], type: TagType.Category, hash: getHash(items[0]) },
    region: {
      name: items[1],
      type: TagType.Region,
      hash: getHash(items[0] + items[1]),
    },
    university: {
      name: items[2],
      type: TagType.University,
      hash: getHash(items[1] + items[2]),
    },
    department: {
      name: items[3],
      type: TagType.Department,
      hash: getHash(items[2] + items[3]),
    },
    course: {
      name: items[4],
      type: TagType.Course,
      hash: getHash(items[3] + items[4]),
    },
    topic: {
      name: items[5],
      type: TagType.Topic,
      hash: getHash(items[4] + items[5]),
    },
  };
  return newHeader;
};

const certificationHeaderParser: HeaderParser = (
  header: string,
): CertificationHeader => {
  const requiredItems = 5;
  const items = header.split(':').map((item) => item.trim());
  if (items.length !== requiredItems) {
    throw new Error(
      `Invalid Certification header format. ${requiredItems} items required. Found ${items.length}. ${wrappedHeader(header)}`,
    );
  }
  const newHeader = {
    root: { name: items[0], type: TagType.Category, hash: getHash(items[0]) },
    organization: {
      name: items[1],
      type: TagType.Organization,
      hash: getHash(items[0] + items[1]),
    },
    certification: {
      name: items[2],
      type: TagType.Certification,
      hash: getHash(items[1] + items[2]),
    },
    module: {
      name: items[3],
      type: TagType.Module,
      hash: getHash(items[2] + items[3]),
    },
    topic: {
      name: items[4],
      type: TagType.Topic,
      hash: getHash(items[3] + items[4]),
    },
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

const preParse = (
  filePath: string,
  lines: string[],
  parserType: ParserType,
): ParserResult => {
  const headerParser = getHeaderParser(parserType);
  return rootParser(filePath, lines, headerParser);
};

const parse = (
  filePath: string,
  lines: string[],
  parserType: ParserType,
): ParserResult => {
  const headerParser = getHeaderParser(parserType);
  return rootParser(filePath, lines, headerParser);
};

const rootParser = (
  filePath: string,
  lines: string[],
  headerParser: HeaderParser,
): ParserResult => {
  const chunks: Chunk[] = chunker(lines, filePath);
  const blocks: Block[] = chunks.map((chunk) => {
    const header = headerParser(chunk.header);
    const questions = bodyParser(chunk, header);
    return {
      header,
      questions,
      filePath: chunk.filePath,
    };
  });
  return { chunks, blocks };
};

const fileParser = (
  file: string,
  filePath: string,
  parserType: ParserType,
  parserOperationMode: ParserOperationMode,
): ParserResult => {
  const lines = file.split('\n');
  try {
    switch (parserOperationMode) {
      case ParserOperationMode.PreParse:
        return preParse(filePath, lines, parserType);
      case ParserOperationMode.Parse:
        return parse(filePath, lines, parserType);
    }
  } catch (error) {
    throw error;
  }
};

export default fileParser;
