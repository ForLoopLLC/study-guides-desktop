import { Question } from '../../../types';

type ActionType =
  | {
      type: 'SET_FIELD';
      field: string;
      value: string | string[];
    }
  | {
      type: 'SET_FIELDS';
      payload: Partial<Question>; // Allows updating multiple fields at once
    }
  | { type: 'RESET'; payload: Question };

// Define the reducer
const questionReducer = (state: Question, action: ActionType): Question => {
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

export default questionReducer;
