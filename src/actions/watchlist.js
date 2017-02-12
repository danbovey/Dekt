import api from 'helpers/api';
import { loadPoster } from 'helpers/image';

export const WATCHLIST_LOADED = 'WATCHLIST_LOADED';

export function load() {
    return dispatch => {
        return api.client.sync.watchlist.get({
                extended: 'full',
                type:'shows'
            })
            .then(watchlist => Promise.all(watchlist.map(show => {
                return api.client.episodes.summary({
                        extended: 'full',
                        id: show.show.ids.slug,
                        season: 1,
                        episode: 1
                    })
                    .then(episode => ({
                        show: show.show,
                        next_episode: episode,
                        unseen: show.show.aired_episodes,
                        inWatchlist: true
                    }))
                    .catch(() => ({
                        show: show.show,
                        next_episode: null,
                        unseen: show.show.aired_episodes,
                        inWatchlist: true
                    }));
            })))
            .then(watchlist => Promise.all(watchlist.map(show => {
                if(show.show.ids.tmdb) {
                    // Load the show poster from TMDB
                    return loadPoster(show.show)
                        .then(tmdbShow => {
                            show.poster_path = tmdbShow.poster_path;
                            return show;
                        })
                        .catch(() => show);
                }

                return show;
            })))
            .then(watchlist => {
                dispatch({
                    type: WATCHLIST_LOADED,
                    payload: watchlist
                });
            });
    };
}
