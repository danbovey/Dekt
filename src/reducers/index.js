import { combineReducers } from 'redux';

import auth from './auth';
import deck from './deck';
import lights from './lights';
import show from './show';

const rootReducer = combineReducers({
  auth,
  deck,
  lights,
  show,
});

export default rootReducer;
