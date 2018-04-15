import { SHOW_PROGRESS_WATCHED, SHOW_LAST_EPISODE } from '../constants/show';

const initialState = { last_episode: {}, progress: {} };

export default (state = initialState, action = {}) => {
  switch(action.type) {
    case SHOW_PROGRESS_WATCHED:
      return {
        ...state,
        progress: {
          ...state.progress,
          [`${action.payload.trakt_id}`]: action.payload.progress
        }
      };
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
