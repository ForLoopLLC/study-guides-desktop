import {
  CollegeHeader,
  ParsedCollegeTopic,
  ParsedCertificationTopic,
  RawTopic,
  CertificationHeader,
} from '../../../types';

import { ParserType } from '../../../enums';

function isCollegeHeader(header: any): header is CollegeHeader {
  return (header as CollegeHeader).region !== undefined;
}

function isCertificationHeader(header: any): header is CertificationHeader {
  return (header as CertificationHeader).organization !== undefined;
}

function toParsedQuestion(rawQuestion: any) {
  return {
    question: rawQuestion.question,
    answer: rawQuestion.answer,
    distractors: [],
    hash: rawQuestion.hash,
    metaTags: [],
    learnMore: '',
    parentHash: rawQuestion.parentHash,
  };
}

// Utility function to format parsed topic as JSON
function formatAsJSON(
  parsedTopic: ParsedCertificationTopic | ParsedCollegeTopic,
): string {
  return JSON.stringify(parsedTopic, null, 2); // Pretty-print with 2-space indentation
}

const outputParsedCollegeTopic = (rawTopic: RawTopic): ParsedCollegeTopic => {
  const { header } = rawTopic;

  // Use type guard to check if it's a CollegeHeader
  if (isCollegeHeader(header)) {
    const parsedTopic = {
      name: header.topic.name,
      type: header.topic.type,
      hash: header.topic.hash,
      parent: {
        name: header.root.name,
        type: header.root.type,
        hash: header.root.hash,
      },
      region: {
        name: header.region.name,
        type: header.region.type,
        hash: header.region.hash,
      },
      university: {
        name: header.university.name,
        type: header.university.type,
        hash: header.university.hash,
      },
      department: {
        name: header.department.name,
        type: header.department.type,
        hash: header.department.hash,
      },
      course: {
        name: header.course.name,
        type: header.course.type,
        hash: header.course.hash,
      },
      topic: {
        name: header.topic.name,
        type: header.topic.type,
        hash: header.topic.hash,
      },
      questions: rawTopic.questions.map(toParsedQuestion),
      toJson() {
        return formatAsJSON(this);
      },
    };

    return parsedTopic;
  }

  throw new Error('Invalid header type');
};

const outputParsedCertificationTopic = (
  rawTopic: RawTopic,
): ParsedCertificationTopic => {
  const { header } = rawTopic;

  // Use type guard to check if it's a CertificationHeader
  if (isCertificationHeader(header)) {
    const parsedTopic = {
      name: header.topic.name,
      type: header.topic.type,
      hash: header.topic.hash,
      parent: {
        name: header.root.name,
        type: header.root.type,
        hash: header.root.hash,
      },
      organization: {
        name: header.organization.name,
        type: header.organization.type,
        hash: header.organization.hash,
      },
      certification: {
        name: header.certification.name,
        type: header.certification.type,
        hash: header.certification.hash,
      },
      module: {
        name: header.module.name,
        type: header.module.type,
        hash: header.module.hash,
      },
      topic: {
        name: header.topic.name,
        type: header.topic.type,
        hash: header.topic.hash,
      },
      questions: rawTopic.questions.map(toParsedQuestion),
      toJson() {
        return formatAsJSON(this);
      },
    };

    return parsedTopic;
  }

  throw new Error('Invalid header type');
};

const toParsedTopic = (
  rawTopic: RawTopic,
  parserType: ParserType,
): ParsedCertificationTopic | ParsedCollegeTopic => {
  switch (parserType) {
    case ParserType.Colleges:
      return outputParsedCollegeTopic(rawTopic);
    case ParserType.Certifications:
      return outputParsedCertificationTopic(rawTopic);
    default:
      throw new Error('Invalid parser type');
  }
};

export default toParsedTopic;
