import qwest from 'qwest';

const tmdb_api_key = '67265207de2e82c26fd875e03b40c17d';

// Load the show poster from TMDB
export const loadPoster = (show, type = 'tv') => {
    return request(show.ids.tmdb, type)
        .then((xhr, tmdbShow) => {
            if(tmdbShow.poster_path) {
                tmdbShow.poster_path = 'https://image.tmdb.org/t/p/w185' + tmdbShow.poster_path;
            }

            return tmdbShow;
        });
};

export const loadBanner = (show, type = 'tv') => {
    return request(show.ids.tmdb, type)
        .then((xhr, tmdbShow) => {
            if(tmdbShow.backdrop_path) {
                tmdbShow.backdrop_path = 'https://image.tmdb.org/t/p/original/' + tmdbShow.backdrop_path;
            }

            return tmdbShow;
        });
};

const request = (tmdbId, type) => {
    return qwest.get(`http://api.themoviedb.org/3/${type}/${tmdbId}`, {
            api_key: tmdb_api_key,
            language: 'en-US'
        }, {
            cache: true
        });
}
