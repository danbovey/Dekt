import {
  SHOW_PROGRESS_WATCHED,
  SHOW_PROGRESS_WATCHED_LOADING,
  SHOW_LAST_EPISODE
} from '../constants/show';

const initialState = { last_episode: {}, progress: {} };

export default (state = initialState, action = {}) => {
  switch(action.type) {
    case SHOW_PROGRESS_WATCHED:
      return {
        ...state,
        progress: {
          ...state.progress,
          loading: false,
          [`${action.payload.trakt_id}`]: action.payload.progress
        }
      };
    /**
     * A show's watch progress is being loaded from the network
     */
    case SHOW_PROGRESS_WATCHED_LOADING:
      return { ...state, progress: { ...state.progress, loading: true } };
    case SHOW_LAST_EPISODE:
      return {
        ...state,
        last_episode: {
          ...state.last_episode,
          [`${action.payload.trakt_id}`]: action.payload.episode
        }
      };
    default:
      return state;
  }
}
