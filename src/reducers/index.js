import { combineReducers } from 'redux';

import auth from './auth';
import config from './config';
import upNext from './upNext';

/**
 * http://redux.js.org/docs/api/combineReducers.html
 */
const rootReducer = combineReducers({
    auth,
    config,
    upNext,
});

export default rootReducer;
