import moment from 'moment';

import api from 'helpers/api';
import { loadImages } from 'helpers/image';

export const SHOW_LOADING = 'SHOW_LOADING';
export const SHOW_LOADED = 'SHOW_LOADED';
export const SHOW_SEASONS_LOADED = 'SHOW_SEASONS_LOADED';
export const SHOW_SEASONS_LOADING = 'SHOW_SEASONS_LOADING';
export const SHOW_PROGRESS_LOADING = 'SHOW_PROGRESS_LOADING';
export const SHOW_PROGRESS_LOADED = 'SHOW_PROGRESS_LOADED';

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
            .then(item => {
                return api.client.shows.watching({
                        id: trakt_id,
                        extended: 'full'
                    })
                    .then(watching => {
                        item.show.usersWatching = watching;
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

export function loadProgress(trakt_id, deck) {
    if(deck.loaded) {
        deck.list.forEach(item => {
            if(item.show.ids.slug == trakt_id) {
                return {
                    type: SHOW_PROGRESS_LOADED,
                    payload: item.progress.seasons
                };
            }
        });
    } else {
        return dispatch => {
            dispatch({ type: SHOW_PROGRESS_LOADING });

            return api.client.shows.progress.watched({
                    id: trakt_id,
                    hidden: false,
                    specials: false,
                    extended: 'full' // TOOD: Not in the docs?
                })
                .then(progress => {
                    dispatch({
                        type: SHOW_PROGRESS_LOADED,
                        payload: progress
                    });
                });
        };
    }
}

// TODO: Move to history/sync reducer
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
                id: show.ids.slug,
                hidden: false,
                specials: false,
                extended: 'full' // TODO: Not in docs?
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
