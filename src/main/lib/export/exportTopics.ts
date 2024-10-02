import {
  ParsedCertificationTopic,
  ParsedCollegeTopic,
  EtlTag,
  EtlQuestion,
  ParsedTag,
} from '../../../types';
import { TagType } from '@prisma/client';
import { addOrUpdateTag, addOrUpdateQuestion } from '../database/export';

function isParsedCollegeTopic(
  topic: ParsedCollegeTopic | ParsedCertificationTopic,
): topic is ParsedCollegeTopic {
  return (topic as ParsedCollegeTopic).course !== undefined;
}

function isParsedCertificationTopic(
  topic: ParsedCollegeTopic | ParsedCertificationTopic,
): topic is ParsedCertificationTopic {
  return (topic as ParsedCertificationTopic).module !== undefined;
}

function getUniqueList(items: EtlTag[]): EtlTag[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.hash)) {
      return false; // Duplicate found
    } else {
      seen.add(item.hash); // Add the unique hash to the set
      return true; // Keep this item
    }
  });
}

function parsedTagToEtlTag(tag: ParsedTag, parentTag?: ParsedTag): EtlTag {
  return {
    hash: tag.hash,
    parentHash: parentTag?.hash || '',
    name: tag.name,
    description: tag.name,
    type: TagType[tag.type],
    metaTags: tag.metaTags,
    contentRating: tag.contentRating,
    contentDescriptors: tag.contentDescriptors,
  };
}

function toEtlTag(
  topic: ParsedCollegeTopic | ParsedCertificationTopic,
  parentTag?: ParsedTag,
): EtlTag {
  return {
    hash: topic.hash,
    parentHash: parentTag?.hash || '',
    name: topic.name,
    description: topic.name,
    type: TagType.Topic,
    metaTags: topic.metaTags,
    contentRating: topic.contentRating,
    contentDescriptors: topic.contentDescriptors,
  };
}

function extractCollegeTags(topic: ParsedCollegeTopic): EtlTag[] {
  const parsedTags = [
    parsedTagToEtlTag(topic.parent),
    parsedTagToEtlTag(topic.region, topic.parent),
    parsedTagToEtlTag(topic.university, topic.region),
    parsedTagToEtlTag(topic.department, topic.university),
    parsedTagToEtlTag(topic.course, topic.department),
    toEtlTag(topic, topic.course),
  ];
  return parsedTags;
}

function extractCertificationTags(topic: ParsedCertificationTopic): EtlTag[] {
  const parsedTags = [
    parsedTagToEtlTag(topic.parent),
    parsedTagToEtlTag(topic.organization, topic.parent),
    parsedTagToEtlTag(topic.certification, topic.organization),
    parsedTagToEtlTag(topic.module, topic.certification),
    toEtlTag(topic, topic.module),
  ];
  return parsedTags;
}

function extractQuestionEtl(
  topic: ParsedCollegeTopic | ParsedCertificationTopic,
): EtlQuestion[] {
  return topic.questions.map((question) => ({
    hash: question.hash,
    parentHash: topic.hash,
    question: question.question,
    answer: question.answer,
    metaTags: question.metaTags,
    distractors: question.distractors,
    learnMore: question.learnMore,
  }));
}

const topicsToEtl = (
  parsedTopics: (ParsedCollegeTopic | ParsedCertificationTopic)[],
): { tags: EtlTag[]; questions: EtlQuestion[] } => {
  const collegeTags: EtlTag[] = parsedTopics
    .filter(isParsedCollegeTopic)
    .map(extractCollegeTags)
    .flat();
  const certificationTags: EtlTag[] = parsedTopics
    .filter(isParsedCertificationTopic)
    .map(extractCertificationTags)
    .flat();

  const tags = getUniqueList([...collegeTags, ...certificationTags]);
  const questions = parsedTopics.map(extractQuestionEtl).flat();

  return { tags, questions };
};

const exportTopics = async (
  parsedTopics: (ParsedCollegeTopic | ParsedCertificationTopic)[],
) => {
  const { tags, questions } = topicsToEtl(parsedTopics);

  // Process tags sequentially
  for (const tag of tags) {
    await addOrUpdateTag(tag);
  }

  // Process questions sequentially
  for (const question of questions) {
    await addOrUpdateQuestion(question);
  }

  // Optionally log or return results
  // console.log(tags, questions);
};

export default exportTopics;
