export const LIGHTS_TOGGLE = 'LIGHTS_TOGGLE';
export const LIGHTS_OFF = 'LIGHTS_OFF';

export function toggle() {
    return {
        type: LIGHTS_TOGGLE
    };
}


export function off() {
    return {
        type: LIGHTS_OFF
    };
}
