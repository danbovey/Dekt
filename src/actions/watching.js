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
                    const item = currentWatching ? currentWatching[currentWatching.itemType] : null;
                    const isSameShow = (result.type == 'episode' && item && item.ids.trakt == result.show.ids.trakt);
                    const isSameMovie = (result.type == 'movie' && item && item.ids.trakt == result.movie.ids.trakt);
                    if(!(isSameShow || isSameMovie)) {
                        return {
                            ...result,
                            itemType: result.type
                        };
                    } else {
                        dispatch({ type: 'IGNORE' });
                    }
                } else {
                    dispatch({ type: WATCHING_CLEAR });
                }
            })
            .then(payload => {
                if(payload && payload[payload.itemType]) {
                    return loadImages(payload)
                        .then(tmdbShow => {
                            payload[payload.itemType].poster_path = tmdbShow.poster_path;
                            payload[payload.itemType].backdrop_path = tmdbShow.backdrop_path;

                            dispatch({
                                type: WATCHING_LOADED,
                                payload
                            });
                        });
                }
            });
    };
}
