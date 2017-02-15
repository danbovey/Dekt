import api from 'helpers/api';
import { loadImages } from 'helpers/image';

export const SEARCH_LOADING = 'SEARCH_LOADING';
export const SEARCH_LOADED = 'SEARCH_LOADED';

export function search(query, type = 'show') {
    return dispatch => {
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
            .then(payload => dispatch({ type: SEARCH_LOADED, payload }));
    };
}
