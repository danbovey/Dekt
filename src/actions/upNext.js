import moment from 'moment';

import api from 'helpers/api';
import { loadImages } from 'helpers/image';

export const UPNEXT_LOADED = 'UPNEXT_LOADED';

export function load() {
    let timestamp = null;
    // const ondeck = [];
    // const onDeckWPosters = [];

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
                        return watched.filter(show => hidden.indexOf(show.show.ids.slug) === -1)
                    })
                    .catch(() => watched);
            })
            .then(watched => Promise.all(watched.map(show => {
                // Get watch progress for shows that have aired episodes
                if(show.show.aired_episodes > 0 && show.show.aired_episodes !== show.plays) {
                    return api.client.shows.progress.watched({
                            extended: 'full',
                            id: show.show.ids.slug,
                            hidden: false,
                            specials: false
                        })
                        .then(progress => {
                            const lastSeason = progress.seasons[progress.seasons.length - 1];
                            const lastEpisodeWatched = lastSeason.episodes[lastSeason.episodes.length - 1].completed
                            if(!lastEpisodeWatched && progress.next_episode && progress.aired > progress.completed) {
                                return {
                                    show: show.show,
                                    next_episode: progress.next_episode,
                                    unseen: progress.aired - progress.completed,
                                    last_watched_at: progress.last_watched_at
                                };
                            }

                            return null;
                        }).catch(function (err) {
                            return null;
                        });
                }
            })))
            .then(watched => watched.filter(item => item != null)) // Filter out any episodes above that are removed above
            .then(watched => Promise.all(watched.map(item => {
                if(item.show.ids.tmdb) {
                    // Load the show poster from TMDB
                    return loadImages(item.show)
                        .then(tmdbShow => {
                            item.poster_path = tmdbShow.poster_path;
                            return item;
                        })
                        .catch(() => item);
                }

                return item;
            })))
            .then(watched => {
                watched.sort((a, b) => {
                    const now = moment();
                    const shows = [a, b];
                    const dates = [a.last_watched_at, b.last_watched_at];

                    for(let i in shows) {
                        if(!shows.hasOwnProperty(i)) continue;
                        const show = shows[i];
                        if(!dates[i]) {
                            if(show.next_episode) {
                                if(now.isAfter(shows[i].next_episode.first_aired)) {
                                    dates[i] = shows[i].next_episode.first_aired;
                                } else {
                                    dates[i] = 0;
                                }
                            } else {
                                dates[i] = 0;
                            }
                        }
                    }

                    return moment(dates[1]).diff(dates[0]);
                });

                return watched;
            })
            .then(watched => dispatch({
                type: UPNEXT_LOADED,
                payload: watched
            }))
            .catch(err => {
                console.error(err);
                dispatch({ type: UPNEXT_LOADED, payload: [] });
            });
    };
}

const findLargest = (arr) => {
    var largest = arr[0];
    for (var i = 0; i < arr.length; i++) {
        if (largest < arr[i] ) largest = arr[i];
    }
    return largest;
};
