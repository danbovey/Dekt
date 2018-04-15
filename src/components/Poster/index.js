import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';

import * as showActions from '../../actions/show';
import * as syncActions from '../../actions/sync';
import Image from './Image';
import Menu from './Menu';
import HistoryBtn from './HistoryBtn';
import CollectBtn from './CollectBtn';
import WatchlistBtn from './WatchlistBtn';
import Titles from './Titles';
import route from '../../helpers/route';

import './style.css';

class Poster extends Component {
  state = { progressing: false, updating: false };

  constructor(props) {
    super(props);

    this.history = this.history.bind(this);
    this.watchlist = this.watchlist.bind(this);
  }

  componentWillMount() {
    const { item, progress } = this.props;
    if (item.itemType === 'show' && !progress) {
      this.props.showActions.get_progress(item.show.ids.trakt, item.last_watched_at);
    }
  }

  componentWillUpdate(nextProps) {
    const lastProgress = this.props.progress;
    const nextProgress = nextProps.progress;
    if (lastProgress && nextProgress && lastProgress.next_episode && nextProgress.next_episode && lastProgress.next_episode.ids.trakt !== nextProgress.next_episode.ids.trakt) {
      window.setTimeout(() => this.setState({ progressing: false }), 250);
    }
  }

  history(watched_at) {
    // TOOD: If this item is in history, toggle off
    this.setState({ progressing: true, updating: true });
    const item = this.props.item;
    this.props.syncActions.history(
        item[item.itemType].ids.trakt,
        item.itemType + 's',
        watched_at
      )
      .then(() => {
        if (item.itemType === 'show') {
          this.props.showActions.get_progress(item.show.ids.trakt)
            .then(progress => {
              if(progress.next_episode) {
                window.setTimeout(() =>
                  this.setState({ updating: false }),
                  250
                );
              }
            });
          }
      });
  }

  watchlist() {
    
  }

  render() {
    const {
      actions = true,
      disabledActions = [],
      item,
      progress,
      showMenu = true,
      titles = true
    } = this.props;
    const { progressing, updating } = this.state;

    // Work out the route the poster links to
    let mainLink = route('shows.single', {
      title: item[item.itemType].ids.slug
    });
    let episodeLink = null;
    if (progress && progress.next_episode) {
      mainLink = route('shows.single', { title: item.show.ids.slug });
      episodeLink = route('show.episode', {
        title: item.show.ids.slug,
        season: progress.next_episode.season,
        episode: progress.next_episode.number
      });
    }
    const link = episodeLink || mainLink;

    return (
      <div
        className={classNames('poster', { 'poster--progressing': progressing })}
      >
        <Image item={item} link={link} updating={updating} />
        {actions && (
          <div className="poster__actions">
            {disabledActions.indexOf('history') === -1 && (
              <HistoryBtn item={item} onClick={() => this.history()} />
            )}
            {disabledActions.indexOf('collect') === - 1&& (
              <CollectBtn item={item} onClick={() => {}} />
            )}
            {disabledActions.indexOf('watchlist') === -1 && (
              <WatchlistBtn item={item} onClick={this.watchlist} />
            )}
            {/*<button className="watch-now">
              <Icon name="play" />
            </button>*/}
            {showMenu && (
              <Menu
                item={item}
                progress={progress}
                disabledActions={disabledActions}
                history={this.history}
              />
            )}
          </div>
        )}
        {titles && (
          <Titles
            item={item}
            progress={progress}
            link={link}
            episodeLink={episodeLink}
            mainLink={mainLink}
          />
        )}
      </div>
    );
  }
}

export default connect(
  (state, props) => ({
    progress: props.item.itemType === 'show'
      ? state.show.progress[props.item.show.ids.trakt]
      : null
  }),
  dispatch => ({
    showActions: bindActionCreators(showActions, dispatch),
    syncActions: bindActionCreators(syncActions, dispatch)
  })
)(Poster);