import moment from 'moment';

import api from 'helpers/api';
import { loadImages } from 'helpers/image';

export const SYNC_HISTORY = 'sync/history';
export const SYNC_HISTORY_FAIL = 'sync/history_fail';

export const SYNC_HISTORY_REMOVE = 'sync/history_remove';
export const SYNC_HISTORY_REMOVE_FAIL = 'sync/history_remove_fail';

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
