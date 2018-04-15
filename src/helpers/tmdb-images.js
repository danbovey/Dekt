import request from 'superagent';

const tmdb_api_key = '67265207de2e82c26fd875e03b40c17d';

// Load the show poster from TMDB
const loadImages = item => {
  // Convert show or episode to 'tv'
  const type = item.itemType === 'movie' ? 'movie' : 'tv';

  // If it's an episode, we want the poster to be the show
  if (item.itemType === 'episode') {
    item = item.show;
  } else {
    item = item[item.itemType];
  }

  if (item.ids.tmdb) {
    const storageKey = `tmdb-images.${item.ids.tmdb}`;
    const stored = localStorage.getItem(storageKey);
    if(stored) {
      return Promise.resolve(JSON.parse(stored));
    }

    return request.get(`https://api.themoviedb.org/3/${type}/${item.ids.tmdb}`)
      .query({ api_key: tmdb_api_key, language: 'en-US' })
      .then(res => {
        const images = {};
        if (res.body.poster_path) {
          images.poster_path = 'https://image.tmdb.org/t/p/w185' + res.body.poster_path;
        }
        if (res.body.backdrop_path) {
          images.backdrop_path = 'https://image.tmdb.org/t/p/original/' + res.body.backdrop_path;
        }

        localStorage.setItem(storageKey, JSON.stringify(images));

        return images;
      })
      .catch(err => {
        console.log(err);
        
        return {};
      });
  }

  return Promise.resolve({});
};

export default loadImages;