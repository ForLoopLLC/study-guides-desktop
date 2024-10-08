import {
  AITopicResponse,
  ParsedCollegeTopic,
  ParsedCertificationTopic,
  ParsedQuestion,
} from '../../../../types';
import { log } from '../../../main';
import { topicPrompt } from '../tags/prompts';
import { questionPrompt } from '../questions/prompts';
import prepareQuestions from './prepareQuestions';
import prepareQuestion from './prepareQuestion';
import { generateChatCompletion } from '../generateChatCompletion';
import { mergeTopicWithAssist } from '.';
import { parseAITopicWithQuestionResponse } from '../tags/parsers';
import { parseAIQuestionResponse } from '../questions/parsers';
import RunQueue from 'run-queue';

const getParsedTopicAssist = async (
  topic: ParsedCertificationTopic | ParsedCollegeTopic,
  onProgress: (data: {
    message: string;
    processed: number;
    total: number;
  }) => void,
  sharedQuestionCounter: { current: number; total: number },
): Promise<ParsedCertificationTopic | ParsedCollegeTopic> => {
  const preparedQuestions = prepareQuestions(topic);
  const result = await generateChatCompletion(
    topicPrompt.text,
    preparedQuestions,
  );

  const queue = new RunQueue({ maxConcurrency: 25 }); // Limit concurrency to 25
  const processedQuestions: ParsedQuestion[] = [];

  // Function to handle each question processing
  const processQuestion = async (
    question: ParsedQuestion,
  ): Promise<ParsedQuestion> => {
    const preparedQuestion = prepareQuestion(question);
    const result = await generateChatCompletion(
      questionPrompt.text,
      preparedQuestion,
    );
    const parsed = parseAIQuestionResponse(result);

    // Increment the shared question counter
    sharedQuestionCounter.current += 1;

    onProgress({
      message: `Processed question: ${question.question}`,
      processed: sharedQuestionCounter.current, // Total questions processed so far
      total: sharedQuestionCounter.total, // Total number of questions across all topics
    });

    return { ...question, ...parsed };
  };

  // Add questions to the queue
  topic.questions.forEach((question) => {
    queue.add(1, async () => {
      const processed = await processQuestion(question);
      processedQuestions.push(processed); // Collect the processed question
    });
  });

  // Wait for all tasks in the queue to finish
  await queue.run();

  try {
    const parsedResult = parseAITopicWithQuestionResponse(result);
    log.info('ai', `Parsed AI response successfully for topic ${topic.name}.`);
    const updatedTopic = mergeTopicWithAssist(
      topic,
      parsedResult as AITopicResponse,
    );
    return {
      ...updatedTopic,
      questions: processedQuestions, // Questions are processed and updated
    };
  } catch (error) {
    const err = error as Error;
    log.error(
      'ai',
      `The result is not in a valid format ${result}. ${err.message}.`,
    );
    log.error('ai', `Bad result. ${JSON.stringify(result)}.`);
    throw new Error('Failed to parse AI response.');
  }
};

export default getParsedTopicAssist;
