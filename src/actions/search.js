import { load as loadWatchlist } from 'actions/watchlist';
import api from 'helpers/api';
import { loadImages } from 'helpers/image';

export const SEARCH_LOADED = 'search/search';
export const SEARCH_LOADING = 'search/search_loading';

export function search(query, type = 'show') {
    return (dispatch, getState) => {
        dispatch({
            type: SEARCH_LOADING,
            payload: {
                query,
                type
            }
        });

        return api.client.search.text({
                type,
                query
            })
            .then(results => Promise.all(results.map(result => {
                const item = {
                    show: result.show,
                    itemType: 'show'
                };

                // If we want to search movies, itemType here is future-proof
                if(item[item.itemType].ids.tmdb) {
                    return loadImages(item)
                        .then(tmdbShow => {
                            item[item.itemType].poster_path = tmdbShow.poster_path;
                            return item;
                        })
                        .catch(() => item);
                }

                return item;
            })))
            .then(items => Promise.all(items.map(item => {
                return api.client.shows.progress.watched({
                        id: item.show.ids.slug,
                        hidden: false,
                        specials: false,
                        extended: 'full' // TODO: Not in the docs?
                    })
                    .then(progress => {
                        return {
                            show: item.show,
                            itemType: 'show',
                            episode: progress.next_episode,
                            progress: {
                                aired: progress.aired,
                                completed: progress.completed,
                                unseen: progress.aired - progress.completed,
                                seasons: progress.seasons,
                                last_watched_at: progress.last_watched_at
                            }
                        };
                    })
                    .catch(() => item);
            })))
            // Load watchlist if not loaded
            .then(items => {
                if(getState().watchlist.loaded == false) {
                    return loadWatchlist()(dispatch)
                        .then(() => items);
                } else {
                    return items;
                }
            })
            // Check to see if search results are in watchlist
            .then(items => {
                const watchlist = getState().watchlist.list;
                items = items.map(item => {
                    if(watchlist.find(w => w.itemType == item.itemType && w[w.itemType].ids.trakt == item[item.itemType].ids.trakt)) {
                        item.inWatchlist = true;
                        console.log(item[item.itemType].title, 'in watchlist!');
                    }
                    return item;
                });

                return items;
            })
            .then(payload => dispatch({ type: SEARCH_LOADED, payload }));
    };
}
