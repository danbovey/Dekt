import { browserHistory } from 'react-router'

import api from 'helpers/api';

export const AUTH_LOADING = 'auth/auth_loading';
export const AUTH_LOADED = 'auth/auth';
export const AUTH_LOGOUT = 'auth/logout';
export const AUTH_FAIL = 'auth/fail';

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
                .catch(err => dispatch({ type: AUTH_FAIL }));
        } else {
            dispatch({ type: AUTH_FAIL });
        }
    };
}

export function exchange(code) {
    return dispatch => {
        return api.exchange(code);
    };
}

export function logout() {
    localStorage.removeItem('trakt.access_token');
    localStorage.removeItem('trakt.refresh_token');
    localStorage.removeItem('trakt.expires');

    window.setTimeout(() => {
        browserHistory.push('/');
    }, 100);

    return {
        type: AUTH_LOGOUT
    };
}
