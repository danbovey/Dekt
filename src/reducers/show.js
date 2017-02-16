import {
    SHOW_LOADING,
    SHOW_LOADED,
    SHOW_SEASONS_LOADED,
    SHOW_SEASONS_LOADING,
    SHOW_PROGRESS_LOADING,
    SHOW_PROGRESS_LOADED
} from 'actions/show';

const initialState = {
    loading: false,
    loaded: true,
    item: null,
    seasons: null,
    seasons_loading: false,
    progress: null,
    progress_loading: false
};

export default function config(state = initialState, action = {}) {
    switch(action.type) {
        case SHOW_LOADING:
            return initialState;
        case SHOW_LOADED:
            return {
                ...state,
                loading: false,
                loaded: true,
                item: action.payload
            };
        case SHOW_SEASONS_LOADING:
            return {
                ...state,
                seasons_loading: true
            };
        case SHOW_SEASONS_LOADED:
            return {
                ...state,
                seasons: action.payload,
                seasons_loading: false
            };
        case SHOW_PROGRESS_LOADING:
            return {
                ...state,
                progress_loading: true
            };
        case SHOW_PROGRESS_LOADED:
            return {
                ...state,
                progress: action.payload,
                progress_loading: false
            };
        default:
            return state;
    }
}
