import api from '../helpers/api';

import {
  USERS_HIDDEN_LOAD,
  USER_HIDDEN_ITEM_ADD,
  USER_HIDDEN_ITEM_REMOVE,
  USER_WATCHING_LOAD,
  USER_WATCHING_CLEAR
} from '../constants/user';

/**
 * Get hidden items
 * @see {@link https://trakt.docs.apiary.io/#reference/users/hidden-items/get-hidden-items}
 */
export const load_hidden = () => dispatch => {
  const storageKey = 'user.hidden_items';
  const hidden = localStorage.getItem(storageKey);
  if(hidden) {
    dispatch({ type: USERS_HIDDEN_LOAD, payload: JSON.parse(hidden) });
  }

  return api.client.users.hidden.get({
      section: 'progress_watched',
      type: 'shows',
      limit: 100
    })
    .then(hidden => hidden.map(item => item.show.ids.trakt))
    .then(hidden => {
      localStorage.setItem(storageKey, JSON.stringify(hidden));
      dispatch({ type: USERS_HIDDEN_LOAD, payload: hidden });
    })
    .catch(err => {
      console.log(err);
    });
};

export const toggle_hidden_item = (
  item,
  item_type = 'shows',
  section = 'progress_watched'
) => dispatch => {
  const ids = [{ ids: item[item.itemType].ids }];
  const method = item.is_hidden ? 'remove' : 'add';
  const actions = {
    add: USER_HIDDEN_ITEM_ADD,
    remove: USER_HIDDEN_ITEM_REMOVE
  };
  const responseAttributes = { add: 'added', remove: 'deleted' };
  const action = actions[method];
  const responseAttribute = responseAttributes[method];
  
  return api.client.users.hidden[method]({ section, [`${item_type}`]: ids })
    .then(res => {
      if(res[responseAttribute][item_type] === 1) {
        dispatch({
          type: action,
          payload: item[item.itemType].ids.trakt
        });
      }
    })
    .catch(err => {
      console.log(err);
    });
};

export const get_watching = () => (dispatch, getState) =>
  api.client.users.watching({ username: 'me' })
    .then(result => {
      if(result) {
        // The user is currently watching an item. If the item is the same
        // as the current state, don't bother changing the state.
        const current = getState().user.watching;
        let isSame = false;
        if(current) {
          // If the new result is different from the current
          const itemType = result.type === 'episode' ? 'show' : 'movie';
          isSame = current[current.itemType].ids.trakt === result[itemType].ids.trakt;
        }
        if(!isSame) {
          dispatch({
            type: USER_WATCHING_LOAD,
            payload: { ...result, itemType: result.type }
          });
        }
      } else {
        // The user is not watching anything
        dispatch({ type: USER_WATCHING_CLEAR });
      }
    })
    .catch(err => {
      console.log(err);
    });