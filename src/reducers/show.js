import {
    SHOW_LOADING,
    SHOW_LOADED,
    
    SHOW_SEASONS_LOADED,
    SHOW_SEASONS_LOADING,

    SHOW_EPISODES_LOADED,
    
    SHOW_PROGRESS_LOADING,
    SHOW_PROGRESS_LOADED,

    SHOW_WATCHING_LOADING,
    SHOW_WATCHING
} from 'actions/show';

const initialState = {
    loading: false,
    loaded: true,
    item: null,
    seasons: null,
    seasons_loading: false,
    progress: null,
    progress_loading: false,
    watching: null,
    watching_loading: false
};

export default function show(state = initialState, action = {}) {
    switch(action.type) {
        case SHOW_LOADING:
            return initialState;
        case SHOW_LOADED:
            return {
                ...state,
                loading: false,
                loaded: true,
                item: action.payload
            };
        case SHOW_SEASONS_LOADING:
            return {
                ...state,
                seasons_loading: true
            };
        case SHOW_SEASONS_LOADED:
            return {
                ...state,
                seasons: action.payload,
                seasons_loading: false
            };
        case SHOW_EPISODES_LOADED:
            return {
                ...state,
                seasons: state.seasons.map(season => {
                    if(season.number == action.payload.season_number) {
                        season.episodes = action.payload.episodes;
                    }

                    return season;
                })
            }
        case SHOW_PROGRESS_LOADING:
            return {
                ...state,
                progress_loading: true
            };
        case SHOW_PROGRESS_LOADED:
            return {
                ...state,
                progress: action.payload,
                progress_loading: false
            };
        case SHOW_WATCHING_LOADING:
            return {
                ...state,
                watching_loading: true
            };
        case SHOW_WATCHING:
            return {
                ...state,
                watching: action.payload,
                watching_loading: false
            };
        default:
            return state;
    }
}
