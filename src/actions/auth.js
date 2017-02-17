import api from 'helpers/api';

export const AUTH_LOADING = 'auth/auth_loading';
export const AUTH_LOADED = 'auth/auth';

export const AUTH_OAUTH_START = 'auth/oauth_start';
export const AUTH_OAUTH_END = 'auth/oauth_end';

export function init(config) {
    api.init(config);

    return {
        type: 'AUTH_INIT'
    };
};

export function load() {
    return dispatch => {
        dispatch({ type: AUTH_LOADING });

        if(localStorage.getItem('trakt.access_token')) {
            return api.client.users.settings()
                .then(settings => dispatch({ type: AUTH_LOADED, payload: settings }))
                .catch(err => dispatch({ type: AUTH_OAUTH_END }));
        } else {
            dispatch({ type: AUTH_OAUTH_START });
        }
    };
}

export function exchange(code) {
    return dispatch => {
        return api.exchange(code)
            .then(() => dispatch({ type: AUTH_OAUTH_END }))
    };
}
