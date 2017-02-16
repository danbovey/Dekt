import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as watchlistActions from 'actions/watchlist';

import PageTopper from 'components/PageTopper';
import Poster from 'components/Poster';
import Spinner from 'components/Spinner';

@connect(
    state => ({
        watchlist: state.watchlist
    }),
    dispatch => ({
        watchlistActions: bindActionCreators(watchlistActions, dispatch)
    })
)
export default class Watchlist extends Component {
    componentWillMount() {
        if(!this.props.watchlist.loaded) {
            this.props.watchlistActions.load();
        }
    }

    render() {
        const {
            watchlist
        } = this.props;

        return (
            <main className="watchlist">
                <PageTopper item={watchlist.list ? watchlist.list[0] : null} title="Watchlist" />
                <div className="container--lg container--poster">
                    {watchlist.list.length > 0 ? watchlist.list.map((item, i) => (
                        <Poster item={item} actions={true} key={i} />
                    )) : watchlist.loaded && watchlist.list.length == 0 ? (
                        <p className="empty-state">
                            Your watchlist is empty!<br />
                            Browse the <a href="https://trakt.tv/movies/anticipated" target="_blank" rel="noopener">Most Anticipated Movies</a> and start adding!
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
