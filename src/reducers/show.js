import {
    SHOW_LOADING,
    SHOW_LOADED
} from 'actions/show';

const initialState = {
    loading: false,
    loaded: true,
    item: null
};

export default function config(state = initialState, action = {}) {
    switch(action.type) {
        case SHOW_LOADING:
            return {
                ...state,
                loading: true,
                loaded: false,
                item: null
            };
        case SHOW_LOADED:
            return {
                ...state,
                loading: false,
                loaded: true,
                item: action.payload
            };
        default:
            return state;
    }
}
