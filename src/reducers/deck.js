import { DECK_WATCHED, DECK_REMOVE } from '../constants/deck';

const initialState = {
  watched_loaded: false,
  watched: [],
  hidden_loaded: false,
  hidden: []
};

export default (state = initialState, action = {}) => {
  switch (action.type) {
    case DECK_WATCHED:
      return {
        ...state,
        watched_loaded: true,
        watched: action.payload
      };
    case DECK_REMOVE:
      if(Array.isArray(action.payload)) {
        return { ...state, hidden_loaded: true, hidden: [...state.hidden, ...action.payload] };
      }

      return { ...state, hidden_loaded: true, hidden: [...state.hidden, action.payload] };
    default:
      return state;
  }
}