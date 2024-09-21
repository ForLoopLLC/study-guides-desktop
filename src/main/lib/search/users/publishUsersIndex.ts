import axios from 'axios';
import { environmentManager } from '../../environment';
import { AlgoliaRecord } from '@prisma/client';

export const publishUsersIndex = async (items: AlgoliaRecord[]) => {
  const headers = environmentManager.getAlgoliaHeaders();
  const baseUrl = environmentManager.getAlgoliaBaseUrl();

  // Create the requests array for multiple addObject actions
  const requests = items.map((item) => {
    // Ensure item.record is an object before spreading it
    const record =
      typeof item.record === 'object' && item.record !== null
        ? item.record
        : {};

    return {
      action: 'addObject', // Upsert behavior (add or replace if exists)
      body: {
        ...record, // Spread record only if it's an object
        objectID: item.id, // Promote record.id to objectID
      },
    };
  });

  try {
    const response = await axios.post(
      `${baseUrl}/1/indexes/users/batch`, // Use the /batch endpoint
      { requests },
      {
        headers: headers,
      },
    );
    return response.data;
  } catch (error) {
    const err = error as Error;
    return { error: err.message };
  }
};

export default publishUsersIndex;
