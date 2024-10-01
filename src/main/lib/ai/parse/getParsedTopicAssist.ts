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

const getParsedTopicAssist = async (
  topic: ParsedCertificationTopic | ParsedCollegeTopic,
  onProgress: (data: {
    message: string;
    processed: number;
    total: number;
  }) => void,
  sharedQuestionCounter: { current: number },
): Promise<ParsedCertificationTopic | ParsedCollegeTopic> => {
  const preparedQuestions = prepareQuestions(topic);
  const result = await generateChatCompletion(
    topicPrompt.text,
    preparedQuestions,
  );

  // Total number of questions to process
  const totalQuestions = topic.questions.length;

  // Process questions in parallel
  const updatedQuestions = await Promise.all(
    topic.questions.map(async (question) => {
      const preparedQuestion = prepareQuestion(question);
      const result = await generateChatCompletion(
        questionPrompt.text,
        preparedQuestion,
      );
      const parsed = parseAIQuestionResponse(result);

      // Increment the shared question counter
      sharedQuestionCounter.current += 1;

      // Send progress update after each question
      onProgress({
        message: `Processed AI-assisted results for question: ${question.question}`,
        processed: sharedQuestionCounter.current, // Use shared counter
        total: totalQuestions,
      });

      return { ...question, ...parsed };
    }),
  );

  try {
    const parsedResult = parseAITopicWithQuestionResponse(result);
    log.info('ai', `Parsed AI response successfully for topic ${topic.name}.`);
    const updatedTopic = mergeTopicWithAssist(
      topic,
      parsedResult as AITopicResponse,
    );
    return {
      ...updatedTopic,
      questions: updatedQuestions,
    };
  } catch (error) {
    const err = error as Error;
    log.error('ai', `The result is not in a valid format ${result}. ${err.message}.`);
    log.error('ai', `Bad result. ${JSON.stringify(result)}.`);
    throw new Error('Failed to parse AI response.');
  }
};


export default getParsedTopicAssist;
