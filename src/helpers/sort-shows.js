import moment from 'moment';

const sortShows = (list, progressState, lastEpisodeState) => {
  return list.sort((a, b) => {
    const dates = [a.last_watched_at, b.last_watched_at];

    [a, b].forEach((item, i) => {
      const progress = progressState[item.show.ids.trakt];
      if(progress) {
        const lastEpisode = lastEpisodeState[item.show.ids.trakt];
        // If the last aired episode of this show is the next episode,
        // sort it among other new shows by air date.
        if(lastEpisode && lastEpisode.ids.trakt === item.show.ids.trakt) {
          dates[i] = moment()
            .add(moment(progress.next_episode.first_aired).valueOf(), 'milliseconds');
        } else if(!dates[i]) {
          if (progress.next_episode) {
            if (moment().isAfter(progress.next_episode.first_aired)) {
              dates[i] = progress.next_episode.first_aired;
            } else {
              dates[i] = 0;
            }
          } else {
            dates[i] = 0;
          }
        }
      }
    });

    return moment(dates[1]).diff(dates[0]);
  });
};

export default sortShows;