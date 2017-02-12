import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import classNames from 'classnames';

import * as watchingActions from 'actions/watching';
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
        watching: state.watching
    }),
    dispatch => ({
        watchingActions: bindActionCreators(watchingActions, dispatch)
    })
)
export default class PageTopper extends Component {
    static defaultProps = {
        abstract: true,
        background: '/img/poster-bg.jpg'
    };

    constructor(props) {
        super(props);

        this.state = initialState;
    }

    componentDidMount() {
        if(!this.props.item) {
            this.pollWatching();

            const watchingTask = window.setInterval(this.pollWatching.bind(this), 20000);
            this.setState({ watchingTask });
        }
    }

    componentDidUpdate() {
        if(!this.props.item && this.props.watching.loaded && !this.state.progressBarTask) {
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
            abstract,
            background,
            title
        } = this.props;

        const topperItem = this.props.item || this.props.watching;

        let link = null;
        let itemTitle = null;

        if(topperItem) {
            if(topperItem.itemType == 'episode') {
                link = `https://trakt.tv/shows/${topperItem.item.slug}/seasons/${topperItem.item.season}/episodes/${topperItem.item.number}`;
                itemTitle = `${topperItem.item.show_title} ${topperItem.item.season}x${topperItem.item.number} "${topperItem.item.title}"`;
            } else if(topperItem.itemType == 'movie') {
                link = `https://trakt.tv/movies/${topperItem.item.ids.slug}`;
                itemTitle = topperItem.item.title;
            }
        }

        return (
            <div
                className={classNames('page-topper', {
                    'page-topper--banner': topperItem && topperItem.item
                })}
            >
                {topperItem && topperItem.item ? (
                    <div>
                        <div className="page-topper__bg" style={{backgroundImage: `url(${topperItem.item.backdrop_path})`}} />
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
                                        dangerouslySetInnerHTML={{__html: itemTitle}}
                                    />
                                </p>
                            </div>
                            <p className="elapsed">{toHHMM(this.state.elapsed)}</p>
                            <p className="duration">{toHHMM(this.state.duration)}</p>
                        </div>
                        <h2>{title}</h2>
                    </div>
                ): (
                    <div>
                        <div
                            className={classNames('page-topper__bg', {
                                'repeat blur': abstract
                            })}
                            style={{backgroundImage: `url(${background})`}}
                        />
                        <h2>{title}</h2>
                    </div>
                )}
            </div>
        );
    }
}
