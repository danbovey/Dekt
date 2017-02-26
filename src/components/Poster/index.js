import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import moment from 'moment';
import classNames from 'classnames';

import * as showActions from 'actions/show';
import * as syncActions from 'actions/sync';
import * as userActions from 'actions/user';
import * as watchingActions from 'actions/watching';
import Dropdown, { Menu, Item, Divider } from 'components/Dropdown';
import Button from 'components/Button';
import Icon from 'components/Icon';
import Spinner from 'components/Spinner';
import DateTimePicker from 'components/DateTimePicker';
import route from 'helpers/route';

import './styles';

@connect(
    state => ({}),
    dispatch => ({
        showActions: bindActionCreators(showActions, dispatch),
        syncActions: bindActionCreators(syncActions, dispatch),
        userActions: bindActionCreators(userActions, dispatch),
        watchingActions: bindActionCreators(watchingActions, dispatch)
    })
)
export default class Poster extends Component {
    static defaultProps = {
        allowHide: false,
        allowHistory: true,
        allowMenu: true,
        allowWatchlist: true,
        titles: true
    };

    constructor(props) {
        super(props);

        this.state = {
            datepicker: false,
            menu: false,
            progressing: false,
            updating: false
        };
    }

    componentWillUpdate(nextProps) {
        const lastEpisode = this.props.item.episode;
        const nextEpisode = nextProps.item.episode;
        if(lastEpisode && nextEpisode && lastEpisode.ids.trakt != nextEpisode.ids.trakt) {
            window.setTimeout(() => {
                this.setState({
                    progressing: false
                });
            }, 250);
        }
    }

    history(watched_at) {
        // TOOD: If this item is in history, toggle off
        this.setState({
            progressing: true,
            updating: true,
        });
        const item = this.props.item;
        this.props.syncActions.history(item[item.itemType].ids.trakt, item.itemType + 's', watched_at)
            .then(() => {
                if(item.show) {
                    this.props.showActions.progress(item.show.ids.trakt)
                        .then(() => {
                            window.setTimeout(() => {
                                this.setState({
                                    updating: false
                                });
                            }, 250);
                        });
                }
            });
    }

    watchlist() {
        this.setState({
            updating: true
        });
        this.props.syncActions.toggleWatchlist(this.props.item)
            .then(() => this.setState({ updating: false }));
    }

    toggleMenu() {
        this.setState({
            menu: !this.state.menu
        });
    }

    checkIn() {
        const item = this.props.item;
        this.props.watchingActions.checkin(item.episode.ids.trakt);
    }

    watchedAt() {
        this.setState({
            datepicker: true
        });
    }

    closeDatePicker() {
        this.setState({
            datepicker: false
        });
    }

    toggleHide() {
        this.props.userActions.hiddenToggle(this.props.item);
    }

    render() {
        const {
            actions,
            allowHide,
            allowHistory,
            allowMenu,
            allowWatchlist,
            item,
            titles
        } = this.props;

        const {
            datepicker,
            progressing,
            updating
        } = this.state;

        let mainLink = route('shows.single', { title: item[item.itemType].ids.slug });;
        let episodeLink = null;
        const itemTitle = item.show ? item.show.title : item.movie.title;

        if(item.itemType == 'episode') {
            mainLink = route('shows.single', { title: item.show.ids.slug });
            episodeLink = route('show.episode', { title: item.show.ids.slug, season: item.episode.season, episode: item.episode.number });
        }

        // TODO: Is an episode poster going to exist? - if episode is watched
        // TODO: If movie is watched
        let itemIsWatched = false;
        if(item.itemType == 'show') {
            itemIsWatched = item.progress && item.progress.aired > 0 && item.progress.aired == item.progress.completed;
        }
        const itemHasEpisode = item.itemType == 'episode' && item.episode;
        // TODO: Poster path should always be in the default itemType
        const posterPath = itemHasEpisode ? item.show.poster_path : item[item.itemType].poster_path;

        return (
            <div
                className={classNames('poster', {
                    'poster--progressing': progressing
                })}
            >
                <div className="poster__images">
                    <Link to={episodeLink || mainLink}>
                        <img src="/img/poster.png" alt="Temporary Poster" className="base" />
                        {posterPath ? (
                            <img src={posterPath} alt="Poster" className="real" />
                        ) : null}
                        {updating ? (
                            <div className="updating">
                                <Spinner type="white" size="medium" />
                            </div>
                        ) : null}
                        {item.is_new ? (
                            <div className="tag new-tag">
                                <div />
                            </div>
                        ) : null}
                        {itemHasEpisode && item.episode.number == 1 ? (
                            <div className="tag premiere-tag">
                                <div />
                            </div>
                        ) : null}
                    </Link>
                </div>
                {actions ? (
                    <div className="poster__actions">
                        {allowHistory ? (
                            <button
                                className={classNames('history', {
                                    'active': itemIsWatched
                                })}
                                onClick={this.history.bind(this, null)}
                            >
                                <Icon name="check" />
                            </button>
                        ) : null}
                        {/*<button className="collect">
                            <Icon name="book" />
                        </button>*/}
                        {allowWatchlist ? (
                            <button
                                onClick={this.watchlist.bind(this)}
                                className={classNames('list', {
                                    'active': item.inWatchlist
                                })}
                            >
                                <Icon name="align-left" />
                            </button>
                        ) : null}
                        {/*<button className="watch-now">
                            <Icon name="play" />
                        </button>*/}
                        {allowMenu && (item.progress.aired > 0 || allowHide) ? (
                            <Dropdown
                                dark={true}
                                menu={(
                                    <Menu placement="right">
                                        {item.progress.aired > 0 ? (
                                            <div>
                                                <Item onClick={this.checkIn.bind(this)}>Check in</Item>
                                                <Item onClick={this.watchedAt.bind(this)}>Watched at...</Item>
                                            </div>
                                        ) : null}
                                        {allowHide ? (
                                            <Item onClick={this.toggleHide.bind(this)}>{item.is_hidden ? 'Unhide this' : 'Hide this'}</Item>
                                        ) : null}
                                    </Menu>
                                )}
                            >
                                <Button type="default">
                                    <Icon name="ellipsis-v" />
                                </Button>
                            </Dropdown>
                        ) : null}
                    </div>
                ) : null}
                {titles ? (
                    <div className="poster__titles">
                        {itemHasEpisode ? (
                            <p
                                className="titles__episode"
                                title={item.episode.season + 'x' + item.episode.number + ' ' + item.episode.title}
                            >
                                <Link to={episodeLink}>
                                    <span className="titles__number">
                                        {item.episode.season + 'x' + item.episode.number}
                                    </span>
                                    <span
                                        className="titles__name"
                                        dangerouslySetInnerHTML={{__html: item.episode.title }}
                                    />
                                    {item.progress && item.progress.unseen ? (
                                        <span className="unseen">{` + ${item.progress.unseen - 1}`}</span>
                                    ) : null}
                                </Link>
                            </p>
                        ) : null}
                        <p
                            className={classNames('titles__show', {
                                'titles--single': !itemHasEpisode
                            })}
                            title={itemTitle}
                        >
                            <Link to={mainLink} dangerouslySetInnerHTML={{__html: itemTitle }} />
                        </p>
                    </div>
                ) : null}
                {datepicker ? (
                    <DateTimePicker
                        onRequestClose={this.closeDatePicker.bind(this)}
                        onChange={this.history.bind(this)}
                        open={true}
                    />
                ) : null}
            </div>
        );
    }
}
