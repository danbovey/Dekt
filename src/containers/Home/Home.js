import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';

import * as deckActions from 'actions/deck';

import PageTopper from 'components/PageTopper';
import Poster from 'components/Poster';
import Spinner from 'components/Spinner';

@connect(
    state => ({
        deck: state.deck,
        watching: state.watching
    }),
    dispatch => ({
        deckActions: bindActionCreators(deckActions, dispatch)
    })
)
export default class Home extends Component {
    componentWillMount() {
        if(!this.props.deck.loaded) {
            this.props.deckActions.load();
        }
    }

    render() {
        const {
            watching,
            deck
        } = this.props;

        return (
            <main className="home">
                <PageTopper title="On deck" />
                <div className="container-lg">
                    {deck.list.length > 0 ? deck.list.map((show, i) => {
                        if(!watching.item || show.show.ids.trakt != watching.item.ids.trakt) {
                            return <Poster item={show} actions={true} allowWatchlist={false} key={i} />;
                        }
                    }) : deck.loaded && deck.list.length == 0 ? (
                        <p className="empty-state">
                            No shows added!<br />
                            Browse <a href="https://trakt.tv/shows/trending" target="_blank" rel="noopener">Trending TV</a> and start bingeing!
                        </p>
                    ) : (
                        <div className="loading">
                            <Spinner size="large" />
                        </div>
                    )}
                </div>
            </main>
        );
    }
}
