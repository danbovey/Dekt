import { swal, close } from 'react-redux-sweetalert';
import moment from 'moment';

import api from 'helpers/api';
import { loadImages } from 'helpers/image';

export const WATCHING_LOADED = 'watching/loaded';
export const WATCHING_CLEAR = 'watching/clear';
export const WATCHING_CHECKIN_CONFLICT = 'watching/checkin_conflict';
export const WATCHING_CHECKIN_CONFLICT_CONFIRM = 'watching/checkin_conflict_confirm'

export function load() {
    return (dispatch, getState) => {
        return api.client.users.watching({
                username: 'me'
            })
            .then(result => {
                if(result) {
                    const currentWatching = getState().watching.item;

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

export function checkin(id, type = 'episode') {
    return (dispatch, getState) => {
        return api.client.checkin.add({
                [`${type}`]: { ids: { trakt: id } }
            })
            .then(resp => {
                return load()(dispatch, getState);
            })
            .catch(err => {
                // If there's an item already in checkin
                if(err.response && err.response.statusCode == 409) {
                    const body = JSON.parse(err.response.body);
                    const expires = moment(body.expires_at).diff(moment(), 'minutes');

                    const watching = getState().watching;
                    let itemTitle = null;
                    if(watching.item) {
                        if(watching.item.itemType == 'episode') {
                            itemTitle = `${watching.item.show.title} ${watching.item.episode.season}x${watching.item.episode.number} "${watching.item.episode.title}"`;
                        } else if(watching.item.itemType == 'movie') {
                            itemTitle = watching.item.movie.title;
                        }
                    }

                    return swal({
                        title: 'Checkin Conflict',
                        text: `You are already watching ${itemTitle || 'something'}.\nIt expires in ${expires} minute${expires != 1 ? 's' : ''}.`,
                        type: 'warning',
                        showConfirmButton: true,
                        onConfirm: close
                    })(dispatch);
                }
            });
    };
}

export function confirmConflict() {
    return { type: WATCHING_CHECKIN_CONFLICT_CONFIRM };
}
