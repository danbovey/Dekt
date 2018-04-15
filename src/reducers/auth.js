import {
  AUTH_LOADING,
  AUTH_LOADED,
  AUTH_LOGOUT,
  AUTH_FAIL
} from '../constants/auth';

const initialState = {
  user: null,
  loaded: false,
  loading: false
};

export default (state = initialState, action = {}) => {
  switch(action.type) {
    case AUTH_LOADING:
      return { ...state, loading: true };
    case AUTH_LOADED:
      return { ...state, loaded: true, loading: false, user: action.payload };
    case AUTH_FAIL:
      return { ...state, loaded: true, loading: false, user: null };
    case AUTH_LOGOUT:
      return initialState;
    default:
      return state;
  }
}
