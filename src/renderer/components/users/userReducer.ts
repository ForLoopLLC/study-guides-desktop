import { User, UserRole } from '../../../types';

type ActionType =
  | { type: 'SET_FIELD'; field: string; value: string | string[] }
  | { type: 'SET_FIELDS'; payload: Partial<User> }
  | { type: 'RESET'; payload: User }
  | { type: 'UPDATE_ROLES'; payload: UserRole[] };

// Define the reducer
const userReducer = (state: User, action: ActionType): User => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_FIELDS':
      return { ...state, ...action.payload };
    case 'RESET':
      return action.payload;
    case 'UPDATE_ROLES':
      return { ...state, roles: action.payload }; // Update roles
    default:
      return state;
  }
};

export default userReducer;
