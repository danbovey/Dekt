import api from 'helpers/api';

export const AUTH_LOADING = 'AUTH_LOADING';
export const AUTH_LOADED = 'AUTH_LOADED';
export const AUTH_OAUTH_START = 'AUTH_OAUTH_START';
export const AUTH_OAUTH_END = 'AUTH_OAUTH_END';

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
            // const oauthWindow = window.open(api.getAuthUrl(), 'Trakt OAuth', 'height=600,width=450');
            // if(oauthWindow) {
            //     oauthWindow.focus();
            // }
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
