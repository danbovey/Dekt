import moment from 'moment';

import api from '../helpers/api';
import { DECK_REMOVE } from '../constants/deck';
import { SHOW_PROGRESS_WATCHED, SHOW_LAST_EPISODE } from '../constants/show';

/**
 * Get show watched progress
 * @see {@link https://trakt.docs.apiary.io/#reference/shows/watched-progress/get-show-watched-progress}
 * 
 * @param {string} show_trakt_id Trakt.tv ID
 * @param {int} last_watched_at Timestamp of when the show was last watched
 */
export const get_progress = (
  show_trakt_id,
  last_watched_at = null
) => dispatch => {
  // Skip loading the show's progress if last watched
  // at is less than or equal to the cached progress.
  const storageKey = `shows.progress.watched.${show_trakt_id}`;
  let progress = localStorage.getItem(storageKey);
  if(progress && last_watched_at) {
    progress = JSON.parse(progress);
    if(Date.parse(last_watched_at) <= Date.parse(progress.last_watched_at)) {
      dispatch({
        type: SHOW_PROGRESS_WATCHED,
        payload: { trakt_id: show_trakt_id, progress }
      });
      return;
    }
  }

  return api.client.shows.progress.watched({
    id: show_trakt_id,
    hidden: false,
    specials: false,
    extended: 'full' // TODO: Not in docs?
  })
  .then(progress => {
    // Save to localStorage
    localStorage.setItem(storageKey, JSON.stringify(progress));

    dispatch({
      type: SHOW_PROGRESS_WATCHED,
      payload: { trakt_id: show_trakt_id, progress }
    });

    // Remove the show if there is no next episode,
    // or the next episode has not yet aired.
    let aired = false;
    if(progress.next_episode) {
      aired = moment(progress.next_episode.first_aired).isBefore();
    }
    if(!progress.next_episode || !aired) {
      dispatch({ type: DECK_REMOVE, payload: show_trakt_id });
    }

    return progress;
  })
  .catch(err => {
    console.log(err);
  });
};

export const get_last_episode = show_trakt_id => dispatch =>
  api.client.shows.last_episode({ id: show_trakt_id })
    .then(last_episode => {
      dispatch({
        type: SHOW_LAST_EPISODE,
        payload: { trakt_id: show_trakt_id, episode: last_episode }
      });
    })
    .catch(err => {
      console.log(err);
    });