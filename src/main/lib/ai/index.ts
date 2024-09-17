import {
  Question,
  PromptType,
  Prompt,
  ContentRatingType,
} from '@prisma/client';
import { environmentManager } from '../environment';
import { getPrompt } from '../database/prompts';
import {
  AIQuestionResponse,
  AITopicResponse,
  AiContentRating,
  TagWithQuestions,
} from '../../../types';

const cleanAIQuestionResponse = (
  aiResponse: AIQuestionResponse,
): AIQuestionResponse => {
  const cleanedResponse: AIQuestionResponse = {
    distractors: aiResponse.distractors.map((d: string) => {
      const trimmed = d.trim();
      return trimmed.endsWith('.') ? trimmed : `${trimmed}.`;
    }),
    learnMore: aiResponse.learnMore.trim(),
  };
  return cleanedResponse;
};

const emptyAITopicResponse = {
    content: {
      rating: ContentRatingType.RatingPending,
      descriptors: [],
    },
    tags: [],
  };
  
  const emptyAIQuestionResponse = {
    learnMore: "",
    distractors: [],
  };
  
  const temporaryTopicPrompt = {
    text: `
  You are a knowledge assistant for a study guide app that helps people learn through a series of questions and answers. Your tasks are as follows:
  
  1. Generate one Content Rating type and as many Content Descriptors as appropriate for the given topic and questions. Choose from the following Content Rating types:
     - Everyone
     - Teen
     - Mature
     - AdultsOnly
     - RatingPending
  
     And the following Content Descriptors:
      - AlcoholReference
      - DrugReference
      - Language
      - SexualContent
      - MedicalTerminology
  
  2. Generate tags for the given topic and questions. The tags should be short and concise, preferably one word each. Try to create at least 10 tags and no more than 50.
  
  Ensure the response a is valid JSON Object and includes results from step 1 and 2 in the following format:
  
  {
    "content": {
      "rating": "Teen",
      "descriptors": ["Language", "AlcoholReference"]
    },
    "tags": ["climate", "change", "environment"]
  }
  `,
  };
  
  const temporaryQuestionPrompt = {
    text: `You are a knowledge assistant for a study guide app that helps people learn through a series of questions and answers. Your tasks are as follows:
  
  1. Generate three plausible but incorrect distractors for the following question. The distractors should be short and concise.
  
  2. Generate a detailed explanation of the correct answer for the following question. Do not use any bold or italic formatting.
  
  Ensure the response is a valid JSON object and includes results from step 1 and 2 in the following format:
  
  {
    "distractors": ["distractor1", "distractor2", "distractor3"],
    "learnMore": "detailed explanation here"
  }
  `,
  };

const stripBackticks = (str: string): string => {
  return str.replace(/^```json\s*|```$/g, '').trim();
};

const fetchCompletion = async (
  promptText: string,
  userPrompt: string,
): Promise<string> => {
  try {
    const client = environmentManager.getAiClient();
    const completion = await client.chat.completions.create({
      model: String(process.env.OPENAI_MODEL),
      messages: [
        {
          role: 'system',
          content: promptText,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const content = completion.choices[0].message?.content || '';
    const cleanedResult = stripBackticks(content);
    return cleanedResult;
  } catch (error) {
    throw error;
  }
};

export const getTopicAssistFromAI = async (
    topic: TagWithQuestions
  ): Promise<AITopicResponse> => {
    const prompt = temporaryTopicPrompt; ////(await getPrompt(PromptType.ContentRating)) as Prompt;
    const userPrompt = getUserTopicPrompt(topic);
  
    const result = await fetchCompletion(prompt.text, userPrompt);
    try {
      const parsedResult = JSON.parse(result);
      return parsedResult as AITopicResponse;
    } catch (error) {
        const err = error as Error;
      console.error(`The result is not a valid JSON string. ${err.message}`);
      return emptyAITopicResponse;
    }
  };

export const getQuestionAssistFromAI = async (
  question: Question,
): Promise<AIQuestionResponse> => {
  const prompt = temporaryQuestionPrompt;
  const userPrompt = getUserQuestionPrompt(question);

  const result = await fetchCompletion(prompt.text, userPrompt);
  try {
    const parsedResult = JSON.parse(result);
    const cleanedResult = cleanAIQuestionResponse(
      parsedResult as AIQuestionResponse,
    );
    return cleanedResult as AIQuestionResponse;
  } catch (error) {
    const err = error as Error;
    console.error(`The result is not a valid JSON string. ${err.message}`);
    return emptyAIQuestionResponse;
  }
};

export const getLearnMore = async (question: Question) => {
  const prompt = await getPrompt(PromptType.LearnMore);
  const userPrompt = `Question: ${question.questionText} - Answer: ${question.answerText}`;
  if (!prompt) {
    throw new Error('Prompt not found');
  }
  return fetchCompletion(prompt.text, userPrompt);
};

export const getDistractors = async (question: Question): Promise<string[]> => {
  const prompt = (await getPrompt(PromptType.Distractors)) as Prompt;
  const userPrompt = `Question: ${question.questionText} - Answer: ${question.answerText}`;
  const result = await fetchCompletion(prompt.text, userPrompt);
  try {
    const parsedResult = JSON.parse(result);

    let distractors: string[];
    if (Array.isArray(parsedResult)) {
      distractors = parsedResult;
    } else if (
      typeof parsedResult === 'object' &&
      Array.isArray(parsedResult.distractors)
    ) {
      distractors = parsedResult.distractors;
    } else {
      distractors = [];
    }

    return distractors;
  } catch (error) {
    const err = error as Error;
    console.error(`The result is not a valid JSON string. ${err.message}`);
    return [];
  }
};

export const getContentRating = async (
  topic: TagWithQuestions,
): Promise<AiContentRating> => {
  const prompt = (await getPrompt(PromptType.ContentRating)) as Prompt;
  const questions = topic.questions.map(
    (link) => `${link.question.questionText} - ${link.question.answerText}`,
  );
  const userPrompt = `Questions: [${questions.join(', ')}]`;

  const result = await fetchCompletion(prompt.text, userPrompt);
  try {
    const parsedResult = JSON.parse(result);
    return parsedResult as AiContentRating;
  } catch (error) {
    const err = error as Error;
    console.error(`The result is not a valid JSON string. ${err.message}`);
    return {
      type: ContentRatingType.RatingPending,
      descriptors: [],
    };
  }
};

export const getMetaTags = async (
  topic: TagWithQuestions,
): Promise<string[]> => {
  const prompt = (await getPrompt(PromptType.Tagging)) as Prompt;
  const questions = topic.questions.map(
    (link) =>
      `${link.question.questionText} - ${link.question.answerText} (additional info: ${link.question.learnMore})`,
  );
  const userPrompt = `Questions: [${questions.join(', ')}]`;
  const result = await fetchCompletion(prompt.text, userPrompt);

  try {
    const parsedResult = JSON.parse(result);
    return parsedResult;
  } catch (error) {
    const err = error as Error;
    console.error(`The result is not a valid JSON string. ${err.message}`);
    return [];
  }
};

function getUserTopicPrompt(topic: TagWithQuestions): string {
  const allQuestions = topic.questions;
  const shuffledQuestions = allQuestions.sort(() => 0.5 - Math.random());
  const selectedQuestions = shuffledQuestions.slice(0, 25);

  const lines = selectedQuestions.map(
    (link, index) =>
      `Q${index + 1}: ${link.question.questionText} A: ${
        link.question.answerText
      }`,
  );

  const userPrompt = `Questions and Answers:\n${lines.join('\n')}`;
  return userPrompt;
}

function getUserQuestionPrompt(question: Question): string {
  return `Here is the question:\nQ: ${question.questionText} A: ${question.answerText}`;
}
