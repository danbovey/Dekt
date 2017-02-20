import {
    WATCHING_LOADED,
    WATCHING_CLEAR,
    WATCHING_CHECKIN_CONFLICT,
    WATCHING_CHECKIN_CONFLICT_CONFIRM
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
        case WATCHING_CHECKIN_CONFLICT:
            return {
                ...state,
                conflict: true
            };
        case WATCHING_CHECKIN_CONFLICT_CONFIRM:
            return {
                ...state,
                conflict: false
            };
        default:
            return state;
    }
}
