import {
    User,
    AlgoliaRecord,
    AlgoliaRecordType,
  } from '@prisma/client';
  import { AlgoliaUserRecord } from '../../../../types';
  import { environmentManager } from '../../environment';
  import {log} from '../../../main';

  
  
  
  const createUserIndex = async (
    user: User,
  ): Promise<AlgoliaRecord | null> => {
    try {
      const prisma = environmentManager.getPrismaClient();
      const algoliaUserRecord: AlgoliaUserRecord = {
        objectID: user.id,
        id: user.id,
        name: user?.name || null,
        gamerTag: user.gamerTag,
        email: user.email,
        image: user?.image || null,
        stripeCustomerId: user?.stripeCustomerId || null,
      };
  
      const record = await prisma.algoliaRecord.upsert({
        where: {
          id: user.id,
        },
        update: {
          id: user.id,
          record: algoliaUserRecord,
          type: AlgoliaRecordType.User,
          updatedAt: new Date(),
          uploaded: false,
        },
        create: {
          id: user.id,
          type: AlgoliaRecordType.User,
          record: algoliaUserRecord,
          createdAt: new Date(),
          updatedAt: new Date(),
          uploaded: false,
        },
      });
  
      return record;
    } catch (error) {
      const err = error as Error;
      log.error('index',`Error adding/updating user search record. ${err.message}.`);
      return null;
    }
  };
  
  export default createUserIndex;
  