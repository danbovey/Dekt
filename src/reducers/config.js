import {
    CONFIG_LOADED,
    CONFIG_FAILED
} from 'actions/config';

const initialState = {
    loaded: false,
    failed: false
};

export default function config(state = initialState, action = {}) {
    switch(action.type) {
        case CONFIG_LOADED:
            return {
                loaded: true,
                ...action.payload
            };
        case CONFIG_FAILED:
            return {
                ...state,
                failed: true
            }
        default:
            return state;
    }
}
