import {
    WATCHING_LOADED,
    WATCHING_CLEAR
} from 'actions/watching';

const initialState = {
    loaded: false,
    item: null
};

export default function config(state = initialState, action = {}) {
    switch(action.type) {
        case WATCHING_LOADED:
            return {
                ...state,
                loaded: true,
                item: action.payload
            };
        case WATCHING_CLEAR:
            return {
                ...state,
                ...initialState
            }
        default:
            return state;
    }
}
