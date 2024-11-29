import { AuthAction } from '../actions/authActions';

export const authReducer = (state, action: AuthAction) => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, user: action.user };
        case 'LOGOUT':
            return { ...state, user: null };
        default:
            return state;
    }
};
