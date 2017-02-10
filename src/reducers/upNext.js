import {
    UPNEXT_LOADED
} from 'actions/upNext';

import {
    SHOW_PROGRESS_WATCHED,
    SHOW_WATCHLIST_ADD,
    SHOW_REMOVE
} from 'actions/show';

const initialState = {
    loaded: false,
    list: []
};

export default function config(state = initialState, action = {}) {
    switch(action.type) {
        case UPNEXT_LOADED:
            return {
                ...state,
                loaded: true,
                ...action.payload
            };
        case SHOW_PROGRESS_WATCHED:
            return {
                ...state,
                list: state.list.map(item => {
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
                })
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
