import qwest from 'qwest';

export const CONFIG_LOADED = 'CONFIG_LOADED';
export const CONFIG_FAILED = 'CONFIG_FAILED';

export function load() {
    return dispatch => {
        qwest.get('/config.json')
            .then((xhr, payload) => dispatch({ type: CONFIG_LOADED, payload }))
            .catch(err => {
                console.error(err);
                dispatch({ type: CONFIG_FAILED });
            });
    };
}
