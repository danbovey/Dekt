import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import classNames from 'classnames';

import * as upNextActions from 'actions/upNext';
import * as watchingActions from 'actions/watching';

import Button from 'components/Button';
import Icon from 'components/Icon';
import Poster from 'components/Poster';
import Spinner from 'components/Spinner';

import { toHHMM } from 'helpers/formatTime';

import './styles';

const initialState = {
    elapsed: 0,
    duration: 0,
    percentage: 0,
    watchingTask: null,
    progressBarTask: null
};

@connect(
    state => ({
        upNext: state.upNext,
        watching: state.watching
    }),
    dispatch => ({
        upNextActions: bindActionCreators(upNextActions, dispatch),
        watchingActions: bindActionCreators(watchingActions, dispatch)
    })
)
export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = initialState;
    }

    componentWillMount() {
        if(!this.props.upNext.loaded) {
            this.props.upNextActions.load();
        }
    }

    componentDidMount() {
        this.pollWatching();

        const watchingTask = window.setInterval(this.pollWatching.bind(this), 20000);
        this.setState({ watchingTask });
    }

    componentDidUpdate() {
        if(this.props.watching.loaded && !this.state.progressBarTask) {
            if(this.props.watching.item == null) {
                this.stopProgressBar();
                this.setState(initialState);
            } else {
                this.startProgressBar();
            }
        }
    }

    componentWillUnmount() {
        this.stopProgressBar();
        this.stopPollingWatching();
    }

    pollWatching() {
        this.props.watchingActions.load(this.props.watching.item);
    }

    startProgressBar() {
        const progressBarTask = window.setInterval(this.progressBar.bind(this), 1000);
        this.setState({ progressBarTask });
    }

    stopProgressBar() {
        window.clearInterval(this.state.progressBarTask);
    }

    stopPollingWatching() {
        window.clearInterval(this.state.watchingTask);
    }

    progressBar() {
        const watching = this.props.watching;

        if(watching.item == null) {
            this.stopProgressBar();
            return;
        }

        const now = moment();
        const started_at = moment(watching.started_at);
        const expires_at = moment(watching.expires_at);

        if(now.isBetween(started_at, expires_at)) {
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

    render() {
        const {
            watching,
            upNext
        } = this.props;

        return (
            <main className="home">
                <div
                    className={classNames('page-topper', {
                        'page-togger--banner': watching.item
                    })}
                >
                    {watching.item ? (
                        <div>
                            <div className="page-topper__bg" style={{backgroundImage: `url(${watching.image})`}} />
                            <div className="watching-bar">
                                <div className="bar" style={{ width: this.state.percentage + '%' }}>
                                    <p className="percentage">{Math.round(this.state.percentage)}%</p>
                                </div>
                                <div className="content">
                                    {watching.itemType == 'episode' ? (
                                        <p>
                                            <a
                                                href={`https://trakt.tv/shows/${watching.item.slug}/seasons/${watching.item.season}/episodes/${watching.item.number}`}
                                                dangerouslySetInnerHTML={{__html: `${watching.item.show_title} ${watching.item.season}x${watching.item.number} "${watching.item.title}"`}}
                                            >
                                            </a>
                                        </p>
                                    ) : (
                                        <p>{watching.item.title}</p>
                                    )}
                                </div>
                                <p className="elapsed">{toHHMM(this.state.elapsed)}</p>
                                <p className="duration">{toHHMM(this.state.duration)}</p>
                            </div>
                        </div>
                    ): (
                        <div>
                            <div className="page-topper__bg repeat blur" style={{backgroundImage: 'url(/img/poster-bg.jpg)'}} />
                            <h2>On deck</h2>
                        </div>
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
