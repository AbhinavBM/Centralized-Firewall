// actions/authActions.ts
import { User } from '../../interfaces';

export type AuthAction =
  | { type: 'LOGIN'; user: User; token: string }
  | { type: 'LOGOUT' };

export const loginAction = (user: User, token: string): AuthAction => ({
  type: 'LOGIN',
  user,
  token,
});

export const logoutAction = (): AuthAction => ({
  type: 'LOGOUT',
});
