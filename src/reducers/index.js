import { combineReducers } from 'redux';

import auth from './auth';
import deck from './deck';
import lights from './lights';
import show from './show';
import user from './user';

const rootReducer = combineReducers({
  auth,
  deck,
  lights,
  show,
  user,
});

export default rootReducer;
