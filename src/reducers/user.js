import { USER_WATCHING_LOAD } from '../constants/user';

const initialState = { watching: null };

export default (state = initialState, action = {}) => {
  switch(action.type) {
    case USER_WATCHING_LOAD:
      return { watching: action.payload };
    default:
      return state;
  }
}
