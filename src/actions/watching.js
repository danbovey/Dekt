import api from 'helpers/api';
import { loadBanner } from 'helpers/image';

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
                            started_at: result.started_at,
                            expires_at: result.expires_at,
                            itemType,
                            item: itemType == 'episode' ? ({
                                ids: result.show.ids,
                                season: result.episode.season,
                                number: result.episode.number,
                                title: result.episode.title,
                                show_title: result.show.title,
                                slug: result.show.ids.slug
                            }) : result.movie
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
                    return loadBanner(payload.item, payload.itemType == 'episode' ? 'tv' : 'movie')
                        .then(tmdbShow => {
                            if(tmdbShow.backdrop_path) {
                                payload.item.backdrop_path = tmdbShow.backdrop_path;
                            }

                            dispatch({
                                type: WATCHING_LOADED,
                                payload
                            });
                        });
                }
            });
    };
}
