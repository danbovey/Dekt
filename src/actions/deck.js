import api from '../helpers/api';
import { DECK_WATCHED, DECK_LOADED, DECK_REMOVE } from '../constants/deck';

/**
 * Get watched shows
 * @see {@link https://trakt.docs.apiary.io/#reference/sync/get-watched/get-watched}
 */
export const load = () => dispatch => {
  const watched = localStorage.getItem('deck.watched');
  if(watched) {
    dispatch({ type: DECK_WATCHED, payload: JSON.parse(watched) });
  }

  return api.client.sync.watched({ type: 'shows', extended: 'full,noseasons' })
    .then(watched => watched.map(item => ({ ...item, itemType: 'show' })))
    .then(watched => {
      localStorage.setItem('deck.watched', JSON.stringify(watched));
      dispatch({ type: DECK_WATCHED, payload: watched });
      dispatch({ type: DECK_LOADED });
    })
    .catch(err => {
      console.log(err);
    });
};

/**
 * Get hidden items
 * @see {@link https://trakt.docs.apiary.io/#reference/users/hidden-items/get-hidden-items}
 */
export const load_hidden = () => dispatch =>
  api.client.users.hidden.get({
      section: 'progress_watched',
      type: 'shows',
      limit: 100
    })
    .then(hidden => hidden.map(item => item.show.ids.trakt))
    .then(hidden => dispatch({ type: DECK_REMOVE, payload: hidden }))
    .catch(err => {
      console.log(err);
    });