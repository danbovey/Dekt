import moment from 'moment';

import api from 'helpers/api';
import { loadImages } from 'helpers/image';

export const SHOW_LOADING = 'SHOW_LOADING';
export const SHOW_LOADED = 'SHOW_LOADED';

export const SHOW_PROGRESS_WATCHED = 'SHOW_PROGRESS_WATCHED';
export const SHOW_WATCHLIST_ADD = 'SHOW_WATCHLIST_ADD';
export const SHOW_REMOVE = 'SHOW_REMOVE';

export function load(trakt_id) {
    return dispatch => {
        dispatch({ type: SHOW_LOADING });

        return api.client.shows.summary({
                id: trakt_id,
                extended: 'full'
            })
            .then(show => {
                const item = {
                    show: show,
                    itemType: 'show'
                };

                return loadImages(item.show)
                    .then(tmdb => {
                        item.show.poster_path = tmdb.poster_path;
                        item.show.backdrop_path = tmdb.backdrop_path;
                        return item;
                    })
                    .catch(() => item);
            })
            .then(payload => dispatch({ type: SHOW_LOADED, payload }));
    };
}

export function progressWatched(showItem, watched_at = null) {
    return dispatch => {
        const episodes = [{
            ids: showItem.next_episode.ids,
            watched_at
        }];
        
        return api.client.sync.history.add({ episodes })
            .then(() => progress(showItem.show)(dispatch));
    };
}

export function progress(show) {
    return dispatch => {
        return api.client.shows.progress.watched({
                extended: 'full',
                id: show.ids.slug,
                hidden: false,
                specials: false
            })
            .then(progress => {
                if(progress.next_episode) {
                    dispatch({
                        type: SHOW_PROGRESS_WATCHED,
                        payload: {
                            trakt_id: show.ids.trakt,
                            next_episode: progress.next_episode
                        }
                    });
                } else {
                    dispatch({
                        type: SHOW_REMOVE,
                        payload: {
                            trakt_id: show.ids.trakt
                        }
                    });
                }
            });
    };
}

export function toggleWatchlist(showItems) {
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
