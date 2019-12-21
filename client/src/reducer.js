export const LOGIN_USER = 'LOGIN_USER';
export const IS_AUTH = 'IS_AUTH';

export default function reducer(state, { type, payload }) {
  switch (type) {
    case LOGIN_USER:
      return { ...state, currentUser: payload };
    case IS_AUTH:
      return { ...state, isAuth: payload };
    default:
      return state;
  }
}
