import moment from 'moment';

import api from 'helpers/api';
import { loadImages } from 'helpers/image';

export const SHOW_LOADED = 'show/show';
export const SHOW_LOADING = 'show/show_loading';

export const SHOW_SEASONS_LOADED = 'show/seasons';
export const SHOW_SEASONS_LOADING = 'show/seasons_loading';

export const SHOW_PROGRESS_LOADED = 'show/progress';
export const SHOW_PROGRESS_LOADING = 'show/progress_loading';

export const SHOW_WATCHING_LOADING = 'show/watching_loading';
export const SHOW_WATCHING = 'show/watching';

export const SHOW_PROGRESS_WATCHED = 'show/progress';
export const SHOW_WATCHLIST_ADD = 'sync/watchlist_add'; // TODO: Move to sync

export const SHOW_REMOVE = 'show/remove';

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

                return loadImages(item)
                    .then(tmdb => {
                        item.show.poster_path = tmdb.poster_path;
                        item.show.backdrop_path = tmdb.backdrop_path;
                        return item;
                    })
                    .catch(() => item);
            })
            .then(item => {
                return api.client.shows.stats({
                        id: trakt_id
                    })
                    .then(stats => {
                        item.show.stats = stats;
                        return item;
                    })
                    .catch(() => item)
            })
            .then(payload => dispatch({ type: SHOW_LOADED, payload }));
    };
}

export function loadSeasons(trakt_id) {
    return dispatch => {
        dispatch({ type: SHOW_SEASONS_LOADING });

        let allSeasons = [];

        return api.client.seasons.summary({
                id: trakt_id,
                extended: 'episodes'
            })
            .then(seasons => {
                allSeasons = seasons;
                return seasons;
            })
            .then(seasons => Promise.all(seasons.map(season => {
                return Promise.all(season.episodes.map(episode => {
                    return api.client.episodes.summary({
                        id: trakt_id,
                        season: episode.season,
                        episode: episode.number,
                        extended: 'full'
                    });
                }));
            })))
            .then(seasonEpisodes => {
                return allSeasons.map((season, i) => {
                    season.episodes = seasonEpisodes[i];
                    return season;
                });
            })
            .then(payload => dispatch({ type: SHOW_SEASONS_LOADED, payload }));
    };
}

export function loadProgress(trakt_id) {
    return (dispatch, getState) => {
        const deck = getState().deck;
        if(deck.loaded) {
            deck.list.forEach(item => {
                if(item.show.ids.slug == trakt_id) {
                    dispatch({
                        type: SHOW_PROGRESS_LOADED,
                        payload: item.progress
                    });
                }
            });
        } else {
            dispatch({ type: SHOW_PROGRESS_LOADING });

            return api.client.shows.progress.watched({
                    id: trakt_id,
                    hidden: false,
                    specials: true,
                    extended: 'full' // TOOD: Not in the docs?
                })
                .then(progress => {
                    dispatch({
                        type: SHOW_PROGRESS_LOADED,
                        payload: progress
                    });
                });
        }
    };
}

export function watching(trakt_id) {
    return dispatch => {
        dispatch({ type: SHOW_WATCHING_LOADING });

        return api.client.shows.watching({
                id: trakt_id,
                extended: 'full'
            })
            .then(watching => {
                dispatch({
                    type: SHOW_WATCHING,
                    payload: watching
                });
            });
    };
}

export function progress(show_trakt_id) {
    return dispatch => {
        return api.client.shows.progress.watched({
                id: show_trakt_id,
                hidden: false,
                specials: false,
                extended: 'full' // TODO: Not in docs?
            })
            .then(progress => {
                if(progress.next_episode) {
                    dispatch({
                        type: SHOW_PROGRESS_WATCHED,
                        payload: {
                            trakt_id: show_trakt_id,
                            next_episode: progress.next_episode
                        }
                    });
                } else {
                    dispatch({
                        type: SHOW_REMOVE,
                        payload: {
                            trakt_id: show_trakt_id
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
