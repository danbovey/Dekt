import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';

import * as upNextActions from 'actions/upNext';

import PageTopper from 'components/PageTopper';
import Poster from 'components/Poster';
import Spinner from 'components/Spinner';

@connect(
    state => ({
        upNext: state.upNext,
        watching: state.watching
    }),
    dispatch => ({
        upNextActions: bindActionCreators(upNextActions, dispatch)
    })
)
export default class Home extends Component {
    componentWillMount() {
        if(!this.props.upNext.loaded) {
            this.props.upNextActions.load();
        }
    }

    render() {
        const {
            watching,
            upNext
        } = this.props;

        return (
            <main className="home">
                <PageTopper title="On deck" />
                <div className="container-lg">
                    {upNext.list.length > 0 ? upNext.list.map((show, i) => {
                        if(!watching.item || show.show.ids.trakt != watching.item.ids.trakt) {
                            return <Poster item={show} actions={true} allowWatchlist={false} key={i} />;
                        }
                    }) : upNext.loaded && upNext.list.length == 0 ? (
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
