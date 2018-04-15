import { LIGHTS_TOGGLE, LIGHTS_OFF } from '../constants/lights';

export const toggle = () => ({ type: LIGHTS_TOGGLE });
export const off = () => ({ type: LIGHTS_OFF });
