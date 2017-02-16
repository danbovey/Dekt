import moment from 'moment';

import {
    DECK_LOADED
} from 'actions/deck';

import {
    SHOW_PROGRESS_WATCHED,
    SHOW_WATCHLIST_ADD,
    SHOW_REMOVE
} from 'actions/show';

const initialState = {
    loaded: false,
    list: []
};

export default function deck(state = initialState, action = {}) {
    switch(action.type) {
        case DECK_LOADED:
            return {
                ...state,
                loaded: true,
                list: sortShows(action.payload)
            };
        case SHOW_PROGRESS_WATCHED:
            const list = state.list.map(item => {
                if(action.payload.trakt_id == item.show.ids.trakt) {
                    return {
                        ...item,
                        next_episode: action.payload.next_episode,
                        user: {
                            ...item.user,
                            watchlist: false
                        }
                    };
                }
                return item;
            });

            return {
                ...state,
                list: sortShows(list)
            };
        case SHOW_WATCHLIST_ADD:
            return {
                ...state,
                list: state.list.map(item => {
                    if(action.payload.trakt_id == item.show.ids.trakt) {
                        return {
                            ...item,
                            user: {
                                ...item.user,
                                watchlist: true
                            }
                        }
                    }
                    return item;
                })
            };
        case SHOW_REMOVE:
            return {
                ...state,
                list: state.list.filter(item => action.payload.trakt_id != item.show.ids.trakt)
            };
        default:
            return state;
    }
}

const sortShows = list => {
    return list.sort((a, b) => {
        const now = moment();
        const shows = [a, b];
        const dates = [a.progress.last_watched_at, b.progress.last_watched_at];

        for(let i in shows) {
            if(!shows.hasOwnProperty(i)) continue;
            const show = shows[i];

            if(show.is_new) {
                // If the show is new make sure it's first, sorted with other new shows by air date
                dates[i] = moment().add(moment(shows[i].next_episode.first_aired).valueOf(), 'milliseconds');
            } else if(!dates[i]) {
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
};
