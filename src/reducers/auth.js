import {
    AUTH_LOADING,
    AUTH_LOADED,
    AUTH_FAIL,

    AUTH_OAUTH_START,
    AUTH_OAUTH_END
} from 'actions/auth';

const initialState = {
    user: null,
    loaded: false,
    loading: false
};

export default function auth(state = initialState, action = {}) {
    switch(action.type) {
        case AUTH_LOADING:
            return {
                ...state,
                loading: true
            };
        case AUTH_LOADED:
            return {
                ...state,
                loaded: true,
                loading: false,
                oauthStarted: false,
                ...action.payload
            };
        case AUTH_OAUTH_START:
            return {
                ...state,
                oauthStarted: true
            };
        case AUTH_OAUTH_END:
            return {
                ...state,
                loaded: false,
                loading: false,
                oauthStarted: false
            };
        default:
            return state;
    }
}
