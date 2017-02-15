import api from 'helpers/api';
import { loadImages } from 'helpers/image';

export const WATCHING_LOADED = 'WATCHING_LOADED';
export const WATCHING_CLEAR = 'WATCHING_CLEAR';

export function load(currentWatching) {
    return dispatch => {
        return api.client.users.watching({
                username: 'me'
            })
            .then(result => {
                if(result) {
                    const isSameShow = (result.type == 'episode' && currentWatching && currentWatching.ids.trakt == result.show.ids.trakt);
                    const isSameMovie = (result.type == 'movie' && currentWatching && currentWatching.ids.trakt == result.movie.ids.trakt);
                    if(!(isSameShow || isSameMovie)) {
                        const itemType = result.type;

                        // The payload
                        return {
                            ...result,
                            itemType
                        };
                    } else {
                        dispatch({ type: 'IGNORE' });
                    }
                } else {
                    dispatch({ type: WATCHING_CLEAR });
                }
            })
            .then(payload => {
                if(payload) {
                    return loadImages(payload.item, payload.itemType == 'episode' ? 'tv' : 'movie')
                        .then(tmdbShow => {
                            payload.poster_path = tmdbShow.poster_path;
                            payload.backdrop_path = tmdbShow.backdrop_path;

                            dispatch({
                                type: WATCHING_LOADED,
                                payload
                            });
                        });
                }
            });
    };
}
