import {
    WATCHLIST_LOADED,
} from 'actions/watchlist';

const initialState = {
    loaded: false,
    list: []
};

export default function config(state = initialState, action = {}) {
    switch(action.type) {
        case WATCHLIST_LOADED:
            return {
                ...state,
                loaded: true,
                list: action.payload
            };
        default:
            return state;
    }
}
