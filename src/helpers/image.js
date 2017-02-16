import qwest from 'qwest';

const tmdb_api_key = '67265207de2e82c26fd875e03b40c17d';

// Load the show poster from TMDB
export const loadImages = item => {
    // Convert show or episode to 'tv'
    let type = 'tv';
    if(item.itemType == 'movie') {
        type = 'movie';
    }

    // If it's an episode, we want the poster to the show
    if(item.itemType == 'episode') {
        item = item.show;
    } else {
        item = item[item.itemType];
    }

    if(item.ids.tmdb) {
        return qwest.get(`https://api.themoviedb.org/3/${type}/${item.ids.tmdb}`, {
                api_key: tmdb_api_key,
                language: 'en-US'
            }, {
                cache: true
            })
            .then((xhr, tmdbShow) => {
                if(tmdbShow.poster_path) {
                    tmdbShow.poster_path = 'https://image.tmdb.org/t/p/w185' + tmdbShow.poster_path;
                }
                if(tmdbShow.backdrop_path) {
                    tmdbShow.backdrop_path = 'https://image.tmdb.org/t/p/original/' + tmdbShow.backdrop_path;
                }

                return tmdbShow;
            })
            .catch(() => ({}));
    }

    return Promise.resolve({});
};
