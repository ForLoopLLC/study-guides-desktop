
import { TagType, ContentRatingType } from '@prisma/client';
import { Tag } from '../../../types';

type ActionType =
  | {
      type: 'SET_FIELD';
      field: string;
      value: string | string[] | TagType | ContentRatingType;
    }
  | { type: 'RESET'; payload: Tag };

// Define the reducer
const tagReducer = (state: Tag, action: ActionType): Tag => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'RESET':
      return action.payload;
    default:
      return state;
  }
};

export default tagReducer;