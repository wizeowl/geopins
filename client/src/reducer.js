export const LOGIN_USER = 'LOGIN_USER';
export const IS_AUTH = 'IS_AUTH';
export const SIGNOUT_USER = 'SIGNOUT_USER';
export const CREATE_DRAFT = 'CREATE_DRAFT';
export const UPDATE_DRAFT_LOCATION = 'UPDATE_DRAFT_LOCATION';

export default function reducer(state, { type, payload }) {
  switch (type) {
    case LOGIN_USER:
      return { ...state, currentUser: payload };
    case IS_AUTH:
      return { ...state, isAuth: payload };
    case SIGNOUT_USER:
      return { ...state, currentUser: null, isAuth: false };
    case CREATE_DRAFT:
      return { ...state, draft: { latitude: 0, longitude: 0 } };
    case UPDATE_DRAFT_LOCATION:
      return {...state, draft: payload}
    default:
      return state;
  }
}
