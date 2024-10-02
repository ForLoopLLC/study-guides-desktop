import { ParsedCertificationTopic, ParsedCollegeTopic } from '../../../types';

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

// Process function for ParsedCollegeTopic
const processCollegeTopic = async (topic: ParsedCollegeTopic) => {
  console.log('Processing college topic:', topic);
};

// Process function for ParsedCertificationTopic
const processCertificationTopic = async (topic: ParsedCertificationTopic) => {
  console.log('Processing certification topic:', topic);
};

const exportTopics = async (
  parsedTopics: (ParsedCollegeTopic | ParsedCertificationTopic)[],
) => {
  for (const topic of parsedTopics) {
    if (isParsedCollegeTopic(topic)) {
      await processCollegeTopic(topic);
    } else if (isParsedCertificationTopic(topic)) {
      await processCertificationTopic(topic);
    } else {
      console.error('Unknown topic type:', topic);
    }
  }

  return Promise.resolve();
};

export default exportTopics;
