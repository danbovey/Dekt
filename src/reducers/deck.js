import { DECK_WATCHED, DECK_LOADED, DECK_REMOVE } from '../constants/deck';

const initialState = {
  loaded: false,
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
    /**
     * The deck has finished loading from the network
     */
    case DECK_LOADED:
      return { ...state, loaded: true };
    case DECK_REMOVE:
      if(Array.isArray(action.payload)) {
        return { ...state, hidden_loaded: true, hidden: [...state.hidden, ...action.payload] };
      }

      return { ...state, hidden_loaded: true, hidden: [...state.hidden, action.payload] };
    default:
      return state;
  }
}