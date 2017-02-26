import {
    AUTH_LOADING,
    AUTH_LOADED,
    AUTH_FAIL,
    AUTH_LOGOUT,

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
                ...action.payload
            };
        case AUTH_LOGOUT: case AUTH_FAIL:
            return initialState;
        default:
            return state;
    }
}
