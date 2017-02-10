import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as upNextActions from 'actions/upNext';

import Button from 'components/Button';
import Icon from 'components/Icon';
import Poster from 'components/Poster';
import Spinner from 'components/Spinner';

import './styles';

@connect(
    state => ({
        upNext: state.upNext
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
                <div className="page-topper">
                    {watching ? (
                        <div className="page-topper__bg" style={{backgroundImage: `url(${watching.image})`}} />
                    ): (
                        <div className="page-topper__bg repeat blur" style={{backgroundImage: 'url(/img/poster-bg.jpg)'}} />
                    )}
                </div>
                <div className="container-lg">
                    {upNext.list.length > 0 ? upNext.list.map((show, i) => (
                        <Poster item={show} actions={true} key={i} />
                    )) : upNext.loaded && upNext.list.length == 0 ? (
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
