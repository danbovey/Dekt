import api from '../helpers/api';

import {
  AUTH_LOADING,
  AUTH_LOADED,
  AUTH_LOGOUT,
  AUTH_FAIL
} from '../constants/auth';
import { init } from '../helpers/api';

export const load = () => dispatch => {
  dispatch({ type: AUTH_LOADING });
  const expires = localStorage.getItem('trakt.expires');
  if(expires && expires > Date.now()) {
    // Re-initialize the Trakt API
    return init()
      .then(() => {
        // Load the user settings in the background from Trakt
        return api.client.users.settings()
          .then(user => {
            // Merge user attributes into top level
            const u = user.user;
            delete user.user;
            user = { ...u, ...user };

            dispatch({ type: AUTH_LOADED, payload: user });

            // Save the user to localStorage
            localStorage.setItem('trakt.user', JSON.stringify(user));
          })
          .catch(err => dispatch({ type: AUTH_FAIL, payload: err }));
      })
      .catch(() => {});
  } else {
    dispatch({ type: AUTH_FAIL });
    
    return Promise.reject();
  }
};

export const logout = () => {
  localStorage.removeItem('trakt.access_token');
  localStorage.removeItem('trakt.refresh_token');
  localStorage.removeItem('trakt.expires');

  return { type: AUTH_LOGOUT };
};
