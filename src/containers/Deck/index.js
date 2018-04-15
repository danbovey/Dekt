import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';

import * as deckActions from '../../actions/deck';
import Poster from '../../components/Poster';
import Spinner from '../../components/Spinner';
import Auth from '../Auth';
import sortShows from '../../helpers/sort-shows';
import './style.css';

class Deck extends Component {
  componentWillMount() {
    this.props.deckActions.load();
    this.props.deckActions.load_hidden();
  }

  render() {
    const { deck, last_episode, progress } = this.props;

    const watched = sortShows(deck.watched, progress, last_episode);
    let on_deck = watched.filter(item => {
      const show_trakt_id = item.show.ids.trakt;
      const item_progress = progress[show_trakt_id];
      if(item_progress) {
        // Hide hidden items
        if(deck.hidden.indexOf(item.show.ids.trakt) > -1) {
          return false;
        }
        // Hide items that are completed
        if(item_progress.aired === item_progress.completed) {
          return false;
        }
        // Hide items that are up-to-date (the last aired episode
        // is watched but previous episodes may be unwatched)
        const show_last_episode = last_episode[show_trakt_id];
        if(show_last_episode && item_progress.last_episode && item_progress.last_episode.ids.trakt === last_episode.ids.trakt) {
          return false;
        }
      }

      return true;
    });

    const today = [];
    const today_ids = [];
    const now = moment();
    on_deck.forEach(item => {
      const item_progress = progress[item.show.ids.trakt];
      if(item_progress && item_progress.next_episode) {
        const air_date = moment(item_progress.next_episode.first_aired);
        if(air_date <= now && air_date.diff(now, 'day') === 0) {
          today.push(item);
          today_ids.push(item.show.ids.trakt);
        }
      }
      if(item.show.ids.slug === 'the-joel-mchale-show-with-joel-mchale') {
        console.log(item_progress);
      }
    });
    console.log(today);

    on_deck = on_deck.filter(item =>
      today_ids.indexOf(item.show.ids.trakt) === -1
    );

    return (
      <Auth>
        <main className="deck">
          {deck.watched_loaded
            ? (
              <div>
                {today.length > 0 && (
                  <div>
                    <h2>Today</h2>
                    <div className="container--lg container--poster container--left">
                      {today.map((item, i) => <Poster item={item} key={i} />)}
                    </div>
                  </div>
                )}
                {on_deck.length > 0
                  ? (
                    <div className="container--lg container--poster">
                      {on_deck.map((item, i) => <Poster item={item} key={i} />)}
                    </div>
                  )
                  : (
                    <div className="container empty-state">
                      You don't have any shows?!
                    </div>
                  )
                }
              </div>
            ) : (
              <Spinner />
            )
          }
        </main>
      </Auth>
    );
  }
}

export default connect(
  state => ({
    user: state.auth.user,
    deck: state.deck,
    last_episode: state.show.last_episode,
    progress: state.show.progress
  }),
  dispatch => ({ deckActions: bindActionCreators(deckActions, dispatch) })
)(Deck);