import { User } from '../../interfaces';

export type AuthAction =
    | { type: 'LOGIN'; user: User }
    | { type: 'LOGOUT' };

export const loginAction = (user: User): AuthAction => ({
    type: 'LOGIN',
    user,
});

export const logoutAction = (): AuthAction => ({
    type: 'LOGOUT',
});
