import api from 'helpers/api';
import { loadImages } from 'helpers/image';

export const WATCHLIST_LOADED = 'WATCHLIST_LOADED';

export function load() {
    return dispatch => {
        return api.client.sync.watchlist.get({
                extended: 'full',
                type:'shows'
            })
            .then(watchlist => Promise.all(watchlist.map(item => {
                item = {
                    show: item.show,
                    itemType: 'show',
                    next_episode: null,
                    unseen: item.show.aired_episodes,
                    inWatchlist: true
                };

                if(item.show.aired_episodes > 0) {
                    return api.client.episodes.summary({
                            extended: 'full',
                            id: item.show.ids.slug,
                            season: 1,
                            episode: 1
                        })
                        .then(episode => {
                            item.next_episode =  episode;
                            return item;
                        })
                        .catch(() => item);
                } else {
                    return item;
                }
            })))
            .then(watchlist => Promise.all(watchlist.map(item => {
                if(item.show.ids.tmdb) {
                    // Load the show poster from TMDB
                    return loadImages(item.show)
                        .then(tmdbShow => {
                            item.show.poster_path = tmdbShow.poster_path;
                            item.show.backdrop_path = tmdbShow.backdrop_path;
                            return item;
                        })
                        .catch(() => item);
                }

                return item;
            })))
            .then(watchlist => {
                dispatch({
                    type: WATCHLIST_LOADED,
                    payload: watchlist
                });
            });
    };
}
