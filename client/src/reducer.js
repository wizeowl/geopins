export const LOGIN_USER = 'LOGIN_USER';

export default function reducer(state, { type, payload }) {
  switch (type) {
    case LOGIN_USER:
      return { ...state, currentUser: payload };
    default:
      return state;
  }
}
