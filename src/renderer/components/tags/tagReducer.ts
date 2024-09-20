import { TagType, ContentRatingType } from '@prisma/client';
import { Tag } from '../../../types';

type ActionType =
  | {
      type: 'SET_FIELD';
      field: string;
      value: string | string[] | TagType | ContentRatingType;
    }
  | {
      type: 'SET_FIELDS';
      payload: Partial<Tag>; // Allows updating multiple fields at once
    }
  | { type: 'RESET'; payload: Tag };

// Define the reducer
const tagReducer = (state: Tag, action: ActionType): Tag => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_FIELDS':
      return { ...state, ...action.payload };
    case 'RESET':
      return action.payload;
    default:
      return state;
  }
};

export default tagReducer;
