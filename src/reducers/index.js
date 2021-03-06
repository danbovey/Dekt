import { combineReducers } from 'redux';
import { reducer as sweetalert } from 'react-redux-sweetalert';

import auth from './auth';
import config from './config';
import deck from './deck';
import lights from './lights';
import search from './search';
import show from './show';
import watching from './watching';
import watchlist from './watchlist';

/**
 * http://redux.js.org/docs/api/combineReducers.html
 */
const rootReducer = combineReducers({
    sweetalert,

    auth,
    config,
    deck,
    lights,
    search,
    show,
    watching,
    watchlist,
});

export default rootReducer;
