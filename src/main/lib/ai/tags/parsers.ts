import { AITopicResponse } from '../../../../types';
import { log } from '../../../main';
import { ContentRatingType } from '@prisma/client';

export const parseAITopicResponse = (input: string): AITopicResponse => {
  return {
    contentRating: ContentRatingType.RatingPending,
    contentDescriptors: [],
    metaTags: [],
  };
};

export const parseAITopicWithQuestionResponse = (
  input: string,
): AITopicResponse => {
  // Matches the Content Rating Type block
  const contentRatingMatch = input.match(/ContentRatingType:\s*(\w+)/);

  // Matches the Content Descriptors block (optional)
  const contentDescriptorsMatch = input.match(
    /ContentDescriptors:\s*([\s\S]*?)(?=Tags:|$)/,
  );

  // Matches the Tags block
  const tagsMatch = input.match(/Tags:\s*([\s\S]*)/);

  // Extract the Content Rating Type
  const contentRatingType = contentRatingMatch
    ? contentRatingMatch[1].trim()
    : '';

  // Extract the Content Descriptors and format them (handle if they are missing)
  const contentDescriptors = contentDescriptorsMatch
    ? contentDescriptorsMatch[1]
        .trim()
        .split('\n')
        .filter((d) => d.trim().startsWith('-')) // Keep only lines that start with '-'
        .map((d) => d.replace(/-\s*/, '').trim()) // Remove the leading '-' and trim
    : [];

  // Ensure that if "None" is present in contentDescriptors, it's handled as a valid descriptor
  if (contentDescriptors.length === 1 && contentDescriptors[0] === 'None') {
    contentDescriptors.length = 0; // Treat "None" as meaning no descriptors
  }

  // Extract the Tags and format them
  const tags = tagsMatch
    ? tagsMatch[1]
        .trim()
        .split('\n')
        .filter((t) => t.trim().startsWith('-')) // Keep only lines that start with '-'
        .map((t) => t.replace(/-\s*/, '').trim()) // Remove the leading '-' and trim
    : [];

  if (!tags.length) {
    console.error('Failed to parse tags from:', input);
  }

  return {
    contentRating: contentRatingType as ContentRatingType,
    contentDescriptors,
    metaTags: tags,
  };
};
