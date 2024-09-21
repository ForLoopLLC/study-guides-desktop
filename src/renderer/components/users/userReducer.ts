import { User } from '../../../types';

type ActionType =
  | {
      type: 'SET_FIELD';
      field: string;
      value: string | string[];
    }
  | {
      type: 'SET_FIELDS';
      payload: Partial<User>; // Allows updating multiple fields at once
    }
  | { type: 'RESET'; payload: User };

// Define the reducer
const userReducer = (state: User, action: ActionType): User => {
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

export default userReducer;
