import api from '../helpers/api';
import { DECK_REMOVE } from '../constants/deck';
import { SHOW_WATCHLIST_ADD } from '../constants/show';
import {
  SYNC_HISTORY,
  SYNC_HISTORY_FAIL,
  SYNC_HISTORY_REMOVE,
  SYNC_HISTORY_REMOVE_FAIL
} from '../constants/sync';

/**
 * Add items to watched history
 * @see {@link https://trakt.docs.apiary.io/#reference/sync/add-to-history/add-items-to-watched-history}
 * 
 * @param  {array} ids - Array of item ids
 * @param  {String} type - episodes, shows or movies
 * @param  {string} watched_at - moment.toIsoString() date
 */
export const history = (
  ids,
  type = 'episodes',
  watched_at = null
) => dispatch => {
    if(!Array.isArray(ids)) {
      ids = [ids];
    }
    const items = ids.map(id => ({ ids: { trakt: id }, watched_at }));
    
    return api.client.sync.history.add({
        [`${type}`]: items
      })
      .then(res => {
        if (res.added[type] === items.length) {
          items.forEach(item => dispatch({
            type: SYNC_HISTORY,
            payload: { trakt_id: item.ids.trakt, type }
          }));
        } else {
          res.not_found[type].forEach(item => dispatch({
            type: SYNC_HISTORY_FAIL,
            payload: { trakt_id: item.ids.trakt }
          }));
        }
      });
};

/**
 * Remove from History
 * @see {@link https://trakt.docs.apiary.io/#reference/sync/remove-from-history/remove-items-from-history}
 * 
 * @param  {array} ids - Array of item ids
 * @param  {String} type - episodes, shows or movies
 */
export const history_remove = (ids, type = 'episodes') => dispatch => {
  if(!Array.isArray(ids)) {
    ids = [ids];
  }
  const items = ids.map(id => ({ ids: { trakt: id } }));

  return api.client.sync.history.remove({
      [`${type}`]: items
    })
    .then(res => {
      if(res.deleted[type] === items.length) {
        items.forEach(item => dispatch({
          type: SYNC_HISTORY_REMOVE,
          payload: { trakt_id: item.ids.trakt, type }
        }));
      } else {
        res.not_found[type].forEach(item => dispatch({
          type: SYNC_HISTORY_REMOVE_FAIL,
          payload: { trakt_id: item.ids.trakt }
        }));
      }
    });
};

export const watchlist_toggle = (showItems, type = 'shows') => dispatch => {
  if(!Array.isArray(showItems)) {
    showItems = [showItems];
  }

  const shows = showItems.map(item => ({ ids: item.show.ids }));
  const showsInWatchlist = {};
  showItems.forEach(item => showsInWatchlist[item.show.ids.trakt] = item.user && item.user.watchlist);

  return Promise.all(shows.map(item => {
    const inWatchlist = showsInWatchlist[item.ids.trakt];
    const method = inWatchlist ? 'remove' : 'add';

    // TODO: Check matched in result is equal
    return api.client.sync.watchlist[method]({ shows })
      .then(result => dispatch({
        type: inWatchlist ? DECK_REMOVE : SHOW_WATCHLIST_ADD,
        payload: { trakt_id: item.ids.trakt }
      }));
  }));
};
