import { combineReducers } from 'redux';

import auth from './auth';
import config from './config';
import lights from './lights';
import upNext from './upNext';
import watching from './watching';
import watchlist from './watchlist';

/**
 * http://redux.js.org/docs/api/combineReducers.html
 */
const rootReducer = combineReducers({
    auth,
    config,
    lights,
    upNext,
    watching,
    watchlist,
});

export default rootReducer;
