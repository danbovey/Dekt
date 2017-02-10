import qwest from 'qwest';
import moment from 'moment';

import api from 'helpers/api';

export const UPNEXT_LOADED = 'UPNEXT_LOADED';

const tmdb_api_key = '67265207de2e82c26fd875e03b40c17d';

export function load() {
    let timestamp = null;
    const ondeck = [];
    const onDeckWPosters = [];
    let watched = [];
    const hidden = [];
    const temp = [];

    return dispatch => {
        api.client.sync.last_activities()
            .then(lastActivities => {
                // Calculate the last time any show was watched
                timestamp = findLargest([
                    lastActivities.episodes.watched_at,
                    lastActivities.seasons.watched_at,
                    lastActivities.shows.watched_at
                ]);
            })
            .then(() => api.client.sync.watched({
                type: 'shows',
                extended: 'full,noseasons'
            }))
            .then(watchedShows => {
                watched = watchedShows;

                return api.client.users.hidden({
                    section: 'progress_watched',
                    type: 'show',
                    limit: 100
                });
            })
            .then(hiddenItems => Promise.all(hiddenItems.map(item => hidden.push(item.show.ids.slug))))
            .then(() => Promise.all(watched.map(show => {
                if(hidden.indexOf(show.show.ids.slug) === -1) {
                    temp.push(show); // store non-hidden shows in 'temp'
                } else {
                    console.log('Remove hidden show: ' + show.show.title);
                }
            })))
            .then(() => Promise.all(temp.map(show => {
                if(show.show.aired_episodes > 0 && show.show.aired_episodes !== show.plays) {
                    console.log('Get shows/id/progress/watched for: ' + show.show.title);
                    return api.client.shows.progress.watched({
                            extended: 'full',
                            id: show.show.ids.slug,
                            hidden: false,
                            specials: false
                        })
                        .then(progress => {
                            if(progress.next_episode && progress.aired > progress.completed) {                    
                                ondeck.push({
                                    show: show.show,
                                    next_episode: progress.next_episode,
                                    unseen: progress.aired - progress.completed,
                                    last_watched_at: progress.last_watched_at
                                });
                            }
                        }).catch(function (err) {
                            return {};
                        });
                } else {
                    console.log('Ignoring: ' + show.show.title);
                }
            })))
            .then(() => {
                console.log('Get watchlisted shows from sync/watchlist/shows');
                return api.client.sync.watchlist.get({
                    extended: 'full',
                    type:'shows'
                });
            })
            .then(watchlisted => Promise.all(watchlisted.map(show => {
                console.log('Get details of s01e01 for: ' + show.show.title);
                return api.client.episodes.summary({
                        extended: 'full',
                        id: show.show.ids.slug,
                        season: 1,
                        episode: 1
                    })
                    .then(episode => {
                        ondeck.push({
                            show: show.show,
                            next_episode: episode,
                            unseen: show.show.aired_episodes,
                            user: {
                                watchlist: true
                            }
                        });
                    })
                    .catch(err => {});
            })))
            .then(() => Promise.all(ondeck.map(show => {
                if(show.show.ids.tmdb) {
                    // Load the show poster from TMDB
                    return qwest.get('http://api.themoviedb.org/3/tv/' + show.show.ids.tmdb, {
                            api_key: tmdb_api_key,
                            language: 'en-US'
                        }, {
                            cache: true
                        })
                        .then((xhr, tmdbShow) => {
                            if(tmdbShow.poster_path) {
                                onDeckWPosters.push({
                                    ...show,
                                    tmdbResp: tmdbShow,
                                    poster_path: 'https://image.tmdb.org/t/p/w185' + tmdbShow.poster_path
                                });
                            }
                        });
                }

                return show;
            })))
            .then(() => {
                onDeckWPosters.sort((a, b) => {
                    if(b.next_episode && b.next_episode.first_aired && a.last_watched_at) {
                        console.log('b episode, a watched');
                        return moment(b.next_episode.first_aired).diff(a.last_watched_at);
                    }

                    // if(b.next_episode && b.next_episode.first_aired && a.last_watched_at) {
                    //     console.log('b episode, a watched');
                    //     return moment(b.next_episode.first_aired).diff(a.last_watched_at);
                    // }

                    if(!a.last_watched_at && !b.last_watched_at && a.next_episode.first_aired && b.next_episode.first_aired) {
                        return moment(b.next_episode.first_aired).diff(a.next_episode.first_aired);
                    }

                    if(!a.last_watched_at) {
                        return 1;
                    }
                    if(!b.last_watched_at) {
                        return -1;
                    }

                    return moment(b.last_watched_at).diff(a.last_watched_at);
                });
            })
            .then(() => dispatch({
                type: UPNEXT_LOADED,
                payload: {
                    list: onDeckWPosters,
                    last_watched: timestamp
                }
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
