import {
    AUTH_LOADING,
    AUTH_LOADED
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
                user: action.payload,
                loaded: true,
                loading: false
            };
        default:
            return state;
    }
}
