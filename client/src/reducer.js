export const LOGIN_USER = 'LOGIN_USER';
export const IS_AUTH = 'IS_AUTH';
export const SIGNOUT_USER = 'SIGNOUT_USER';
export const CREATE_DRAFT = 'CREATE_DRAFT';
export const UPDATE_DRAFT_LOCATION = 'UPDATE_DRAFT_LOCATION';
export const DELETE_DRAFT = 'DELETE_DRAFT';
export const SET_PINS = 'SET_PINS';
export const SET_PIN = 'SET_PIN';
export const CREATE_PIN = 'CREATE_PIN';
export const DELETE_PIN = 'DELETE_PIN';
export const CREATE_COMMENT = 'CREATE_COMMENT';

export default function reducer(state, { type, payload }) {
  switch (type) {
    case LOGIN_USER:
      return { ...state, currentUser: payload };
    case IS_AUTH:
      return { ...state, isAuth: payload };
    case SIGNOUT_USER:
      return { ...state, currentUser: null, isAuth: false };
    case CREATE_DRAFT:
      return { ...state, draft: { latitude: 0, longitude: 0 }, currentPin: null };
    case UPDATE_DRAFT_LOCATION:
      return { ...state, draft: payload };
    case DELETE_DRAFT:
      return { ...state, draft: null };
    case SET_PINS:
      return { ...state, pins: payload };
    case SET_PIN:
      return { ...state, currentPin: payload, draft: null };
    case CREATE_PIN: {
      const newPin = payload;
      const prevPins = state.pins.filter(pin => pin._id !== newPin._id);
      return { ...state, pins: [...prevPins, newPin] };
    }
    case CREATE_COMMENT: {
      const updatedPin = payload;
      const prevPins = state.pins.filter(pin => pin._id !== updatedPin._id);
      return {
        ...state,
        pins: [...prevPins, updatedPin],
        currentPin: updatedPin
      };
    }
    case DELETE_PIN:
      return { ...state, pins: state.pins.filter(pin => pin._id !== payload._id) };
    default:
      return state;
  }
}
