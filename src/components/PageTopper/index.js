import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import classNames from 'classnames';

import * as showActions from 'actions/show';
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

    componentDidUpdate(prevProps) {
        // If this component isn't hardcoded to use an image as a background
        if(!this.props.item) {
            // If there is no longer an item and we're running the task
            if(!this.props.watching.item && this.state.progressBarTask) {
                this.stopProgressBar();
            // If the current watching item is different from the last
            } else if(prevProps.watching.item && this.props.watching.item && prevProps.watching.item.ids.trakt != this.props.watching.item.ids.trakt) {
                this.stopProgressBar();
                this.startProgressbar();
                // Tell the deck that something may have changed with the previous show
                this.props.showActions.progress(prevProps.watching.item);
            // If there is a new item being watched and we haven't started the task
            } else if(this.props.watching.loaded && !this.state.progressBarTask) {
                if(this.props.watching.item == null) {
                    this.stopProgressBar();
                } else {
                    this.startProgressBar();
                }
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
        this.setState(initialState);
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
            item,
            title,
            watching
        } = this.props;

        let topperItem = watching;
        if(item) {
            topperItem = item;
            topperItem.item = topperItem.show;
        }

        let link = null;
        let itemTitle = null;

        if(topperItem && topperItem.item) {
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
                        <div className="page-topper__bg" style={{backgroundImage: `url(${topperItem.backdrop_path})`}} />
                        {watching && watching.item ? (
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
                        ) : null}
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
