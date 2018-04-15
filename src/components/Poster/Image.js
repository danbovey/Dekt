import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Spinner from '../Spinner';
import loadImages from '../../helpers/tmdb-images';

class Image extends Component {
  state = { poster_url: null };

  componentWillMount() {
    this.loadPoster(this.props);
  }

  componentWillReceiveProps(props) {
    // If the poster item changes, update the image
    const { item } = this.props;
    const { item: newItem } = props;
    if(item[item.itemType].ids.trakt !== newItem[newItem.itemType].ids.trakt) {
      this.loadPoster(props);
    }
  }

  loadPoster(props) {
    loadImages(props.item)
      .then(images => this.setState({ poster_url: images.poster_path }))
  }
  
  render() {
    const { item, link, updating } = this.props;
    const { poster_url } = this.state;

    const itemHasEpisode = item.itemType === 'episode' && item.episode;

    return (
      <div className="poster__image">
        <Link to={link}>
          <img src="/img/poster.png" alt="Temporary Poster" className="base" />
          {poster_url && (
            <img src={poster_url} alt="Poster" className="real" />
          )}
          {updating && (
            <div className="updating">
              <Spinner type="white" size="medium" />
            </div>
          )}
          {item.is_new && (
            <div className="tag new-tag">
              <div />
            </div>
          )}
          {itemHasEpisode && item.episode.number === 1 && (
            <div className="tag premiere-tag">
              <div />
            </div>
          )}
        </Link>
      </div>
    );
  }
}

export default Image;