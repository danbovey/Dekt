import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import classNames from 'classnames';

import * as showActions from '../../actions/show';
import * as userActions from '../../actions/user';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import loadImages from '../../helpers/tmdb-images';
import { toHHMM } from '../../helpers/time';

import './style.css';

const initialState = {
  elapsed: 0,
  duration: 0,
  percentage: 0,
  watchingTask: null,
  progressBarTask: null,
  backdrop_path: null
};

class CurrentWatching extends Component {
  static defaultProps = { abstract: true, background: '/img/poster-bg.jpg' };

  constructor(props) {
    super(props);

    this.state = initialState;

    this.pollWatching = this.pollWatching.bind(this);
    this.progressBar = this.progressBar.bind(this);
  }

  componentWillMount() {
    this.loadBackdrop();
  }

  componentDidMount() {
    if (!this.props.item) {
      this.pollWatching();

      const watchingTask = window.setInterval(this.pollWatching, 20000);
      this.setState({ watchingTask });
    }
  }

  componentDidUpdate(prevProps) {
    // If this component isn't hardcoded to use an image as a background
    if (!this.props.item) {
      const prevItem = prevProps.watching;
      const currItem = this.props.watching;

      // If there is no longer an item and we're running the task
      if (!currItem && this.state.progressBarTask) {
        this.stopProgressBar();
        if (prevItem) {
          // Tell the deck that something may have changed with the previous show
          this.props.showActions.get_progress(prevItem);
        }
      // If the current watching item is different from the last
      } else if (prevItem && currItem && prevItem[prevItem.itemType].ids.trakt !== currItem[currItem.itemType].ids.trakt) {
        this.stopProgressBar();
        this.startProgressBar();
        // Tell the deck that something may have changed with the previous show
        this.props.showActions.get_progress(prevItem);
        this.loadBackdrop();
      // If there is a new item being watched and we haven't started the task
      } else if (this.props.watching && currItem && !this.state.progressBarTask) {
        this.startProgressBar();
        this.loadBackdrop();
      }
    }
  }

  componentWillUnmount() {
    this.stopProgressBar();
    this.stopPollingWatching();
  }

  loadBackdrop() {
    const topperItem = this.props.item ? this.props.item : this.props.watching;
    if(topperItem) {
      loadImages(topperItem)
        .then(images => this.setState({ backdrop_path: images.backdrop_path }));
    }
  }

  pollWatching() {
    this.props.userActions.get_watching();
  }

  startProgressBar() {
    const progressBarTask = window.setInterval(this.progressBar, 1000);
    this.setState({ progressBarTask });
  }

  stopProgressBar() {
    window.clearInterval(this.state.progressBarTask);
    this.setState(initialState);
  }

  stopPollingWatching() {
    window.clearInterval(this.state.watchingTask);
  }

  progressBar() {
    const watching = this.props.watching;

    if (watching === null) {
      this.stopProgressBar();
      return;
    }

    const now = moment();
    const started_at = moment(watching.started_at);
    const expires_at = moment(watching.expires_at);

    if (now.isBetween(started_at, expires_at)) {
      let elapsed = now.diff(started_at, 'second');
      let duration = expires_at.diff(started_at, 'second');
      const percentage = (elapsed * 100 / duration);
      elapsed = elapsed / 60;
      duration = duration / 60;

      this.setState({
        elapsed,
        duration,
        percentage
      });
    }
  }

  confirmConflict() {
    this.props.watchingActions.confirmConflict();
  }

  render() {
    const {
      abstract,
      background,
      children,
      item,
      onRefresh,
      title,
      watching
    } = this.props;
    const { backdrop_path } = this.state;

    const topperItem = item || watching;

    let link = null;
    let itemTitle = null;
    let itemBackdrop = null;

    if (topperItem) {
      if (topperItem.itemType === 'episode') {
        link = `/shows/${topperItem.show.ids.slug}/seasons/${topperItem.episode.season}/episodes/${topperItem.episode.number}`;
        const episodeTitle = topperItem.episode.title ? ' "' + topperItem.episode.title + '"' : '';
        itemTitle = `${topperItem.show.title} ${topperItem.episode.season}x${topperItem.episode.number}${episodeTitle}`;
      } else if (topperItem.itemType === 'movie') {
        link = `/movies/${topperItem.movie.ids.slug}`;
        itemTitle = topperItem.movie.title;
      }

      itemBackdrop = backdrop_path;
    }

    const defaultBackdrop = (
      <div
        className={classNames('current-watching__bg', {
          'repeat blur': abstract
        })}
        style={{ backgroundImage: `url(${background})` }}
      />
    );

    return (
      <div
        className={classNames('current-watching', {
          'current-watching--banner': topperItem
        })}
      >
        {topperItem ? (
          <div>
            {itemBackdrop ? (
              <div className="current-watching__bg" style={{ backgroundImage: `url(${itemBackdrop})` }} />
            ) : defaultBackdrop}
            {!item && watching ? (
              <div className="watching-bar">
                <div className="bar" style={{ width: this.state.percentage + '%' }}>
                  <p className="percentage">{Math.round(this.state.percentage)}%</p>
                </div>
                <div className="content">
                  <p>
                    <a
                      href={link || '#'}
                      target="_blank"
                      rel="noopener"
                      dangerouslySetInnerHTML={{ __html: itemTitle }}
                    />
                  </p>
                </div>
                <p className="elapsed">{toHHMM(this.state.elapsed)}</p>
                <p className="duration">{toHHMM(this.state.duration)}</p>
              </div>
            ) : null}
            {title && (
              <h2>{title}</h2>
            )}
            {children}
          </div>
        ) : (
            <div>
              {defaultBackdrop}
              {title ? (
                <h2>{title}</h2>
              ) : null}
              {children}
              {onRefresh && (
                <Button
                  theme="clear"
                  onClick={onRefresh}
                  className="btn--refresh"
                >
                  <Icon name="sync" />
                </Button>
              )}
            </div>
          )}
      </div>
    );
  }
}

export default connect(
  state => ({ watching: state.user.watching }),
  dispatch => ({
    showActions: bindActionCreators(showActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch)
  })
)(CurrentWatching);