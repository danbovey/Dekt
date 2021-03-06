import moment from 'moment';

import api from 'helpers/api';
import { loadImages } from 'helpers/image';

export const SYNC_HISTORY = 'sync/history';
export const SYNC_HISTORY_FAIL = 'sync/history_fail';

export const SYNC_HISTORY_REMOVE = 'sync/history_remove';
export const SYNC_HISTORY_REMOVE_FAIL = 'sync/history_remove_fail';

/**
 * Add items to watched history
 * @see {@link http://docs.trakt.apiary.io/#reference/sync/add-to-history}
 * 
 * @param  {array} ids - Array of item ids
 * @param  {String} type - episodes, shows or movies
 * @param  {string} watched_at - moment.toIsoString() date
 */
export function history(ids, type = 'episodes', watched_at = null) {
    return dispatch => {
        if(!Array.isArray(ids)) {
            ids = [ids];
        }
        const items = ids.map(id => ({
            ids: { trakt: id },
            watched_at
        }));
        
        return api.client.sync.history.add({
                [`${type}`]: items
            })
            .then(resp => {
                if(resp.added[type] == items.length) {
                    items.forEach(item => dispatch({
                        type: SYNC_HISTORY,
                        payload: {
                            trakt_id: item.ids.trakt,
                            type
                        }
                    }));
                } else {
                    resp.not_found[type].forEach(item => dispatch({
                        type: SYNC_HISTORY_FAIL,
                        payload: {
                            trakt_id: item.ids.trakt
                        }
                    }));
                }
            });
    };
}

/**
 * Remove from History
 * @see {@link http://docs.trakt.apiary.io/#reference/sync/remove-from-history}
 * 
 * @param  {array} ids - Array of item ids
 * @param  {String} type - episodes, shows or movies
 */
export function historyRemove(ids, type = 'episodes') {
    return dispatch => {
        if(!Array.isArray(ids)) {
            ids = [ids];
        }
        const items = ids.map(id => ({
            ids: { trakt: id }
        }));

        return api.client.sync.history.remove({
                [`${type}`]: items
            })
            .then(resp => {
                if(resp.deleted[type] == items.length) {
                    items.forEach(item => dispatch({
                        type: SYNC_HISTORY_REMOVE,
                        payload: {
                            trakt_id: item.ids.trakt,
                            type
                        }
                    }));
                } else {
                    resp.not_found[type].forEach(item => dispatch({
                        type: SYNC_HISTORY_REMOVE_FAIL,
                        payload: {
                            trakt_id: item.ids.trakt
                        }
                    }));
                }
            });
    };
}

export function toggleWatchlist(showItems, type = 'shows') {
    return dispatch => {
        if(!Array.isArray(showItems)) {
            showItems = [showItems];
        }

        const shows = showItems.map(item => ({ ids: item.show.ids }));
        const showsInWatchlist = {};
        showItems.forEach(item => showsInWatchlist[item.show.ids.trakt] = item.user && item.user.watchlist);

        return Promise.all(shows.map(item => {
            const inWatchlist = showsInWatchlist[item.ids.trakt];
            const method = inWatchlist ? 'remove' : 'add';

            return api.client.sync.watchlist[method]({ shows }) // TODO: Check matched in result is equal
                .then(result => dispatch({
                    type: inWatchlist ? SHOW_REMOVE : SHOW_WATCHLIST_ADD,
                    payload: {
                        trakt_id: item.ids.trakt
                    }
                }));
        }));
    };
}
