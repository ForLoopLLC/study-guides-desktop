import axios from 'axios';
import { environmentManager } from '../../environment';
import { AlgoliaRecord } from '@prisma/client';

export const publishTagIndex = async (record: AlgoliaRecord) => {
  const headers = environmentManager.getAlgoliaHeaders();
  const baseUrl = environmentManager.getAlgoliaBaseUrl();

  // Ensure objectID is set
  const recordWithObjectID = {
    ...record,
    objectID: record.id, // Promote record.id to objectID
  };

  try {
    const response = await axios.post(
      `${baseUrl}/1/indexes/tags`,
      recordWithObjectID,
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
