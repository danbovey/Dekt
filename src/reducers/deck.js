import { DECK_WATCHED, DECK_LOADED, DECK_REMOVE } from '../constants/deck';
import {
  USERS_HIDDEN_LOAD,
  USER_HIDDEN_ITEM_ADD,
  USER_HIDDEN_ITEM_REMOVE
} from '../constants/user';

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
    /**
     * The show is no longer on deck
     * or a show has been added to hidden
     * 
     * @param {int} Trakt ID
     */
    case DECK_REMOVE: case USER_HIDDEN_ITEM_ADD:
      return {
        ...state,
        hidden: [...state.hidden, action.payload]
      };
    /**
     * A show has been removed from hidden
     * 
     * @param {int} Trakt ID
     */
    case USER_HIDDEN_ITEM_REMOVE:
      return {
        ...state,
        hidden: state.hidden.filter(id => id !== action.payload)
      }
    /**
     * Hidden items have been loaded from Trakt
     * 
     * @param {array} Hidden Trakt IDs
     */
    case USERS_HIDDEN_LOAD:
      return {
        ...state,
        hidden_loaded: true,
        hidden: [...state.hidden, ...action.payload]
      };
    default:
      return state;
  }
}