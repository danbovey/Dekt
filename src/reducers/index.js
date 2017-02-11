import { combineReducers } from 'redux';

import auth from './auth';
import config from './config';
import upNext from './upNext';
import watching from './watching';

/**
 * http://redux.js.org/docs/api/combineReducers.html
 */
const rootReducer = combineReducers({
    auth,
    config,
    upNext,
    watching,
});

export default rootReducer;
