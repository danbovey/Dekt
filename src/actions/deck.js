import moment from 'moment';

import api from 'helpers/api';
import { loadImages } from 'helpers/image';

export const DECK_LOADED = 'DECK_LOADED';

export function load() {
    return dispatch => {
        api.client.sync.watched({
                type: 'shows',
                extended: 'full,noseasons'
            })
            .then(watched => {
                // Remove any hidden shows
                return api.client.users.hidden({
                        section: 'progress_watched',
                        type: 'show',
                        limit: 100
                    })
                    .then(hidden => {
                        hidden = hidden.map(item => item.show.ids.slug);
                        return watched.filter(item => hidden.indexOf(item.show.ids.slug) === -1)
                    })
                    .catch(() => watched);
            })
            .then(watched => Promise.all(watched.map(item => {
                // Get watch progress for shows that have aired episodes
                if(item.show.aired_episodes > 0) {
                    return api.client.shows.progress.watched({
                            extended: 'full',
                            id: item.show.ids.slug,
                            hidden: false,
                            specials: false
                        })
                        .then(progress => {
                            const lastSeason = progress.seasons[progress.seasons.length - 1];
                            const lastEpisodeWatched = lastSeason.episodes[lastSeason.episodes.length - 1].completed;
                            if(!lastEpisodeWatched && progress.next_episode && progress.aired > progress.completed) {
                                return {
                                    show: item.show,
                                    itemType: 'show',
                                    next_episode: progress.next_episode,
                                    unseen: progress.aired - progress.completed,
                                    last_watched_at: progress.last_watched_at
                                };
                            }

                            return null;
                        }).catch(() => null);
                }
            })))
            // Filter out any episodes above that are removed above
            .then(watched => watched.filter(item => item != null))
            .then(watched => Promise.all(watched.map(item => {
                // If the show is still running, check if the next episode is the latest episode
                if(item.show.status != 'ended') {
                    return api.client.shows.last_episode({
                            id: item.show.ids.trakt
                        })
                        .then(lastEpisode => {
                            item.is_new = lastEpisode.ids.trakt == item.next_episode.ids.trakt;
                            return item;
                        })
                        .catch(() => item);
                }

                return item;
            })))
            .then(watched => Promise.all(watched.map(item => {
                if(item.show.ids.tmdb) {
                    // Load the show poster from TMDB
                    return loadImages(item)
                        .then(tmdbShow => {
                            item.show.poster_path = tmdbShow.poster_path;
                            return item;
                        })
                        .catch(() => item);
                }

                return item;
            })))
            .then(watched => dispatch({
                type: DECK_LOADED,
                payload: watched
            }))
            .catch(err => {
                console.error(err);
                dispatch({ type: DECK_LOADED, payload: [] });
            });
    };
}
