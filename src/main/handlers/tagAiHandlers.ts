// export { default as getContentRating } from './tags/getContentRating';
// export { default as getTagWithQuestionsAssist } from './tags/getTagWithQuestionsAssist';

import { ipcMain } from 'electron';
import { log } from '../main';
import {
  getTagInput,
  getContentRatingInput,
} from '../lib/ai';

ipcMain.handle('get-content-rating-assist', async (_event, tagId) => {
  try {
    const tagInput = await getContentRatingInput(tagId);
    log.info('ai', `Received AI content rating for tag ${tagInput.name}.`);
    return tagInput;
  } catch (error) {
    const err = error as Error;
    log.error('ai', `Failed to get AI tag content rating for ${tagId}. ${err.message}`);
    throw new Error('Failed to get AI tag content rating.');
  }
});

ipcMain.handle('get-tag-assist', async (_event, tagId) => {
  try {
    const tagInput = await getTagInput(tagId);
    log.info('ai', `Received AI assist for tag ${tagInput.name}.`);
    return tagInput;
  } catch (error) {
    const err = error as Error;
    log.error('ai', `Failed to get AI tag assist for ${tagId}. ${err.message}`);
    throw new Error('Failed to get AI tag assist.');
  }
});
