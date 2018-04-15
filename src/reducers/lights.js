import { LIGHTS_TOGGLE, LIGHTS_OFF } from '../constants/lights';

const initialState = { on: false };

export default (state = initialState, action = {}) => {
  switch(action.type) {
    case LIGHTS_TOGGLE:
      return { on: !state.on };
    case LIGHTS_OFF:
      return { on: false };
    default:
      return state;
  }
}
