import api from '../helpers/api';
import { DECK_WATCHED, DECK_LOADED } from '../constants/deck';

/**
 * Get watched shows
 * @see {@link https://trakt.docs.apiary.io/#reference/sync/get-watched/get-watched}
 */
export const load = () => dispatch => {
  const storageKey = 'deck.watched';
  const watched = localStorage.getItem(storageKey);
  if(watched) {
    dispatch({ type: DECK_WATCHED, payload: JSON.parse(watched) });
  }

  return api.client.sync.watched({ type: 'shows', extended: 'full,noseasons' })
    .then(watched => watched.map(item => ({ ...item, itemType: 'show' })))
    .then(watched => {
      localStorage.setItem(storageKey, JSON.stringify(watched));
      dispatch({ type: DECK_WATCHED, payload: watched });
      dispatch({ type: DECK_LOADED });
    })
    .catch(err => {
      console.log(err);
    });
};

