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
    question: ParsedQuestion;
    processed: number;
    total: number;
  }) => void,
): Promise<ParsedCertificationTopic | ParsedCollegeTopic> => {
  const preparedQuestions = prepareQuestions(topic);
  const result = await generateChatCompletion(
    topicPrompt.text,
    preparedQuestions,
  );

  // Total number of questions to process
  const totalQuestions = topic.questions.length;
  let processedQuestions = 0;

  const updatedQuestions = await Promise.all(
    topic.questions.map(async (question) => {
      const preparedQuestion = prepareQuestion(question); // Prepare the question
      const result = await generateChatCompletion(
        questionPrompt.text,
        preparedQuestion,
      ); // Call the AI completion
      const parsed = parseAIQuestionResponse(result); // Parse the AI response

      processedQuestions += 1;

      // Send progress update
      onProgress({
        message: `Processed AI assisted results for question: ${question.question}`,
        question: { ...question, ...parsed },
        processed: processedQuestions,
        total: totalQuestions,
      });

      return {
        ...question,
        ...parsed,
      };
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
    log.error(
      'ai',
      `The result is not in a valid format ${result}. ${err.message}.`,
    );
    log.error('ai', `Bad result. ${JSON.stringify(result)}.`);
    throw new Error('Failed to parse AI response.');
  }
};

export default getParsedTopicAssist;
