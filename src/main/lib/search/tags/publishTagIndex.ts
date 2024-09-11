import axios from 'axios';
import { environmentManager } from '../../environment';
import { AlgoliaRecord } from '@prisma/client';

export const publishTagIndex = async (records: AlgoliaRecord[]) => {
  const headers = environmentManager.getAlgoliaHeaders();
  const baseUrl = environmentManager.getAlgoliaBaseUrl();

  // Create the requests array for multiple addObject actions
  const requests = records.map((record) => ({
    action: 'addObject', // Upsert behavior (add or replace if exists)
    body: {
      ...record,
      objectID: record.id, // Promote record.id to objectID
    },
  }));

  try {
    const response = await axios.post(
      `${baseUrl}/1/indexes/tags/batch`, // Use the /batch endpoint
      { requests },
      {
        headers: headers,
      },
    );
    return response.data;
  } catch (error: any) {
    return { error: error.message };
  }
};

export default publishTagIndex;
