import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import classNames from 'classnames';

import * as showActions from 'actions/show';
import * as watchingActions from 'actions/watching';
import { toHHMM } from 'helpers/time';

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
            const prevItem = prevProps.watching.item;
            const currItem = this.props.watching.item;

            // If there is no longer an item and we're running the task
            if(!currItem && this.state.progressBarTask) {
                this.stopProgressBar();
            // If the current watching item is different from the last
            } else if(prevItem && currItem && prevItem[prevItem.itemType].ids.trakt != currItem[currItem.itemType].ids.trakt) {
                this.stopProgressBar();
                this.startProgressBar();
                // Tell the deck that something may have changed with the previous show
                this.props.showActions.progress(prevProps.watching.item);
            // If there is a new item being watched and we haven't started the task
            } else if(this.props.watching.loaded && currItem && !this.state.progressBarTask) {
                this.startProgressBar();
            }
        }
    }

    componentWillUnmount() {
        this.stopProgressBar();
        this.stopPollingWatching();
    }

    pollWatching() {
        this.props.watchingActions.load();
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
        const started_at = moment(watching.item.started_at);
        const expires_at = moment(watching.item.expires_at);

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

    confirmConflict() {
        this.props.watchingActions.confirmConflict();
    }

    render() {
        const {
            abstract,
            background,
            children,
            item,
            title,
            watching
        } = this.props;

        let topperItem = watching.item;
        if(item) {
            topperItem = item;
        }

        let link = null;
        let itemTitle = null;
        let itemBackdrop = null;

        if(topperItem) {
            if(topperItem.itemType == 'episode') {
                link = `/shows/${topperItem.show.ids.slug}/seasons/${topperItem.episode.season}/episodes/${topperItem.episode.number}`;
                const episodeTitle = topperItem.episode.title ? ' "' + topperItem.episode.title + '"' : '';
                itemTitle = `${topperItem.show.title} ${topperItem.episode.season}x${topperItem.episode.number}${episodeTitle}`;
            } else if(topperItem.itemType == 'movie') {
                link = `/movies/${topperItem.movie.ids.slug}`;
                itemTitle = topperItem.movie.title;
            }

            itemBackdrop = topperItem[topperItem.itemType].backdrop_path;
        }

        const defaultBackdrop = (
            <div
                className={classNames('page-topper__bg', {
                    'repeat blur': abstract
                })}
                style={{backgroundImage: `url(${background})`}}
            />
        );

        return (
            <div
                className={classNames('page-topper', {
                    'page-topper--banner': topperItem
                })}
            >
                {topperItem ? (
                    <div>
                        {itemBackdrop ? (
                            <div className="page-topper__bg" style={{backgroundImage: `url(${itemBackdrop})`}} />
                        ) : defaultBackdrop}
                        {!item && watching.item ? (
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
                        {title ? (
                            <h2>{title}</h2>
                        ) : null}
                        {children}
                    </div>
                ) : (
                    <div>
                        {defaultBackdrop}
                        {title ? (
                            <h2>{title}</h2>
                        ) : null}
                        {children}
                    </div>
                )}
            </div>
        );
    }
}
