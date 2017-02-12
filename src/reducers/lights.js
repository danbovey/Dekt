import {
    LIGHTS_TOGGLE,
    LIGHTS_OFF
} from 'actions/lights';

const initialState = {
    on: false
};

export default function config(state = initialState, action = {}) {
    switch(action.type) {
        case LIGHTS_TOGGLE:
            return {
                on: !state.on
            };
        case LIGHTS_OFF:
            return {
                on: false
            };
        default:
            return state;
    }
}
