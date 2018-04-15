import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';

import rootReducer from './reducers';
import { USER_WATCHING_CLEAR } from './constants/user';

let finalCreateStore;
if(process.env.NODE_ENV !== 'production') {
  const logger = createLogger({
    level: 'info',
    collapsed: true,
    timestamp: false,
    predicate: (getState, action) =>
      typeof action.type !== 'undefined' && action.type !== USER_WATCHING_CLEAR
  });
  finalCreateStore = compose(applyMiddleware(logger, thunk))(createStore);
} else {
  finalCreateStore = compose(applyMiddleware(thunk)(createStore));
}

// Check if we've got a cached version of the user
let user = localStorage.getItem('trakt.user');
if(user) {
  user = JSON.parse(user);
}
const initialState = { auth: { user } };

const store = finalCreateStore(rootReducer, initialState);

export default store;