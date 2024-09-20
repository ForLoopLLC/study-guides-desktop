import axios from 'axios';
import { environmentManager } from '../../environment';

export const unpublishUsersIndex = async (id: string) => {
  const headers = environmentManager.getAlgoliaHeaders();
  const baseUrl = environmentManager.getAlgoliaBaseUrl();

  try {
    const response = await axios.post(
      `${baseUrl}/1/indexes/users/batch`, // Use the /batch endpoint for deletion
      {
        requests: [
          {
            action: 'deleteObject', // Deletion action
            body: {
              objectID: id, // Use the provided id as the objectID
            },
          },
        ],
      },
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

export default unpublishUsersIndex;
