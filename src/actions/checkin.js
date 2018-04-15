import Alert from 'react-s-alert';
import moment from 'moment';

import api from '../helpers/api';

export const checkin = (id, type = 'episode') => (dispatch, getState) =>
  api.client.checkin.add({ [`${type}`]: { ids: { trakt: id } } })
    .then(res => {
      console.log(res);
      // TODO: Trigger a refresh of the current watching
    })
    .catch(err => {
      // If there's an item already in checkin
      if(err.response && err.response.statusCode === 409) {
        const body = JSON.parse(err.response.body);
        const expires = moment(body.expires_at).diff(moment(), 'minutes');

        const watching = getState().user.watching;
        let itemTitle = null;
        if(watching.item) {
            if(watching.item.itemType === 'episode') {
                itemTitle = `${watching.item.show.title} ${watching.item.episode.season}x${watching.item.episode.number} "${watching.item.episode.title}"`;
            } else if(watching.item.itemType === 'movie') {
                itemTitle = watching.item.movie.title;
            }
        }

        return Alert.error(
          `You are already watching ${itemTitle || 'something'}.\nIt expires in ${expires} minute${expires !== 1 ? 's' : ''}.`
        );
      }
    });