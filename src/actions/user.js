import api from '../helpers/api';

import {
  USER_HIDDEN_ITEM_ADD,
  USER_HIDDEN_ITEM_REMOVE,
  USER_WATCHING_LOAD,
  USER_WATCHING_CLEAR
} from '../constants/user';

export const toggle_hidden_item = (
  item,
  item_type = 'shows',
  section = 'progress_watched'
) => dispatch => {
  const ids = [{ ids: item[item.itemType].ids }];
  const method = item.is_hidden
    ? USER_HIDDEN_ITEM_REMOVE
    : USER_HIDDEN_ITEM_ADD;
  
  return api.client.users.hidden[method]({ section, [`${item_type}`]: ids })
    .then(res => {
      if(res.deleted[item_type] === 1) {
        dispatch({
          type: method,
          payload: { trakt_id: ids.trakt, item_type }
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