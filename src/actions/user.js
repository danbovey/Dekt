import api from 'helpers/api';

export const USER_HIDDEN_ADD = 'user/hidden_add';
export const USER_HIDDEN_ADD_FAIL = 'user/hidden_add_fail'
export const USER_HIDDEN_REMOVE = 'user/hidden_remove';
export const USER_HIDDEN_REMOVE_FAIL = 'user/hidden_remove_fail';

export function hiddenToggle(item, type = 'shows') {
    return dispatch => {
        if(item.is_hidden) {
            return api.client.users.hidden.remove({
                    section: 'progress_watched',
                    [`${type}`]: [{ ids: item[item.itemType].ids }]
                })
                .then(resp => {
                    if(resp.deleted[type] == 1) {
                        dispatch({
                            type: USER_HIDDEN_REMOVE,
                            payload: {
                                trakt_id: item[item.itemType].ids.trakt,
                                type
                            }
                        });
                    } else {
                        dispatch({
                            type: USER_HIDDEN_REMOVE_FAIL,
                            payload: {
                                trakt_id: item[item.itemType].ids.trakt
                            }
                        });
                    }
                });
        } else {
            return api.client.users.hidden.add({
                    section: 'progress_watched',
                    [`${type}`]: [{ ids: item[item.itemType].ids }]
                })
                .then(resp => {
                    if(resp.added[type] == 1) {
                        dispatch({
                            type: USER_HIDDEN_ADD,
                            payload: {
                                trakt_id: item[item.itemType].ids.trakt,
                                type
                            }
                        });
                    } else {
                        dispatch({
                            type: USER_HIDDEN_ADD_FAIL,
                            payload: {
                                trakt_id: item[item.itemType].ids.trakt
                            }
                        });
                    }
                });
        }
    };
}
