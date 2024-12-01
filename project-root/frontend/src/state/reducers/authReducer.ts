// reducers/authReducer.ts
import { AuthAction } from '../actions/authActions';
import { User } from '../../interfaces';

interface AuthState {
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
};

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.user, token: action.token };
    case 'LOGOUT':
      return { ...state, user: null, token: null };
    default:
      return state;
  }
};
