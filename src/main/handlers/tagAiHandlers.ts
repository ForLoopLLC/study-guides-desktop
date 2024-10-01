import { ipcMain } from 'electron';
import { log } from '../main';
import { getTagInput } from '../lib/ai';

import { getTagsCursor, updateTag } from '../lib/database/tags';
import { createTagIndex } from '../lib/database/search';
import { publishTagIndex } from '../lib/search/tags';
import { Tag } from '@prisma/client';
import { Channels } from '../../enums';
import { logAndSend } from '../util';

ipcMain.handle(Channels.GetTagAssist, async (_event, tagId) => {
  try {
    const tagInput = await getTagInput(tagId);
    log.info('ai', `Received AI assist for tag ${tagInput.name}.`);
    return tagInput;
  } catch (error) {
    const err = error as Error;
    log.error('ai', `Failed to get AI tag assist for ${tagId}. ${err.message}`);
    return { error: err.message };
  }
});

ipcMain.handle(Channels.BatchAssistTags, async (event, { filter, query }) => {
  try {
    const limit = 500;
    let allTags: Tag[] = [];
    let nextCursor: string | null = null;
    let totalProcessed = 0;
    let hasMore = true;

    while (hasMore) {
      const { data: tags, nextCursor: newCursor } = await getTagsCursor(
        nextCursor,
        limit,
        filter,
        query,
      );

      if (tags.length === 0) {
        hasMore = false;
        break;
      }

      const inputs = await Promise.all(tags.map((tag) => getTagInput(tag.id)));
      allTags = allTags.concat(tags);

      // Process tags with AI assistant and update them
      const updatedTags = await Promise.all(
        inputs.map((input) => updateTag(input)),
      );

      // Create and publish tag indexes for the updated tags
      const indexes = await Promise.all(
        updatedTags
          .filter((x) => x !== null)
          .map((tag) => createTagIndex(tag, [])),
      );
      await publishTagIndex(indexes.filter((index) => index !== null));

      // Update totalProcessed and emit progress to the frontend
      totalProcessed += tags.length;
      const payload = { totalProcessed };
      logAndSend(event, Channels.BatchAssistTagsProgress, payload);

      // Move the cursor to the next page
      nextCursor = newCursor;
      if (!nextCursor) {
        hasMore = false;
      }
    }

    // Send completion event to frontend
    logAndSend(event, Channels.BatchAssistTagsComplete, { totalProcessed });
  } catch (error) {
    const err = error as Error;
    logAndSend(event, Channels.BatchAssistTagsError, { message: err.message });
    throw new Error('Failed to assist.');
  }
});
