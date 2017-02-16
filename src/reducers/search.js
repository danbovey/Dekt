import {
    SEARCH_LOADING,
    SEARCH_LOADED
} from 'actions/search';

const initialState = {
    loading: false,
    loaded: false,
    query: null,
    type: null,
    results: [],
};

export default function config(state = initialState, action = {}) {
    switch(action.type) {
        case SEARCH_LOADING:
            return {
                ...state,
                loading: true,
                loaded: false,
                query: action.payload.query,
                type: action.payload.type,
                results: []
            };
        case SEARCH_LOADED:
            return {
                ...state,
                loading: false,
                loaded: true,
                results: action.payload
            }
        default:
            return state;
    }
}
