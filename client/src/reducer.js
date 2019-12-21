export const LOGIN_USER = 'LOGIN_USER';
export const IS_AUTH = 'IS_AUTH';
export const SIGNOUT_USER = 'SIGNOUT_USER';

export default function reducer(state, { type, payload }) {
  switch (type) {
    case LOGIN_USER:
      return { ...state, currentUser: payload };
    case IS_AUTH:
      return { ...state, isAuth: payload };
    case SIGNOUT_USER:
      return { ...state, currentUser: null, isAuth: false };
    default:
      return state;
  }
}
