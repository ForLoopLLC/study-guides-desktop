import {
  CollegeHeader,
  ParsedCollegeTopic,
  ParsedCertificationTopic,
  RawTopic,
  CertificationHeader,
} from '../../../types';

import { ParserType } from '../../../enums';
import { ContentRatingType } from '@prisma/client';
import { formatAsJSON } from '../../util';

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
        contentRating: ContentRatingType.RatingPending,
        contentDescriptors: [],
        metaTags: [],
      },
      region: {
        name: header.region.name,
        type: header.region.type,
        hash: header.region.hash,
        contentRating: ContentRatingType.RatingPending,
        contentDescriptors: [],
        metaTags: [],
      },
      university: {
        name: header.university.name,
        type: header.university.type,
        hash: header.university.hash,
        contentRating: ContentRatingType.RatingPending,
        contentDescriptors: [],
        metaTags: [],
      },
      department: {
        name: header.department.name,
        type: header.department.type,
        hash: header.department.hash,
        contentRating: ContentRatingType.RatingPending,
        contentDescriptors: [],
        metaTags: [],
      },
      course: {
        name: header.course.name,
        type: header.course.type,
        hash: header.course.hash,
        contentRating: ContentRatingType.RatingPending,
        contentDescriptors: [],
        metaTags: [],
      },
      topic: {
        name: header.topic.name,
        type: header.topic.type,
        hash: header.topic.hash,
        contentRating: ContentRatingType.RatingPending,
        contentDescriptors: [],
        metaTags: [],
      },
      questions: rawTopic.questions.map(toParsedQuestion),
      contentRating: ContentRatingType.RatingPending,
      contentDescriptors: [],
      metaTags: [],
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
        contentRating: ContentRatingType.RatingPending,
        contentDescriptors: [],
        metaTags: [],
      },
      organization: {
        name: header.organization.name,
        type: header.organization.type,
        hash: header.organization.hash,
        contentRating: ContentRatingType.RatingPending,
        contentDescriptors: [],
        metaTags: [],
      },
      certification: {
        name: header.certification.name,
        type: header.certification.type,
        hash: header.certification.hash,
        contentRating: ContentRatingType.RatingPending,
        contentDescriptors: [],
        metaTags: [],
      },
      module: {
        name: header.module.name,
        type: header.module.type,
        hash: header.module.hash,
        contentRating: ContentRatingType.RatingPending,
        contentDescriptors: [],
        metaTags: [],
      },
      topic: {
        name: header.topic.name,
        type: header.topic.type,
        hash: header.topic.hash,
        contentRating: ContentRatingType.RatingPending,
        contentDescriptors: [],
        metaTags: [],
      },
      questions: rawTopic.questions.map(toParsedQuestion),
      contentRating: ContentRatingType.RatingPending,
      contentDescriptors: [],
      metaTags: [],
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
