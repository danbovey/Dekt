import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import moment from 'moment';
import classNames from 'classnames';

import * as showActions from 'actions/show';
import * as syncActions from 'actions/sync';
import * as userActions from 'actions/user';
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
        userActions: bindActionCreators(userActions, dispatch)
    })
)
export default class Poster extends Component {
    static defaultProps = {
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
        const lastEpisode = this.props.item.next_episode;
        const nextEpisode = nextProps.item.next_episode;
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
        this.props.syncActions.history(item.next_episode.ids.trakt, 'episodes', watched_at)
            .then(() => this.props.showActions.progress(item.show.ids.trakt))
            .then(() => {
                window.setTimeout(() => {
                    this.setState({
                        updating: false
                    });
                }, 250);
            });
    }

    watchlist() {
        this.setState({
            updating: true
        });
        this.props.showActions.toggleWatchlist(this.props.item)
            .then(() => this.setState({ updating: false }));
    }

    toggleMenu() {
        this.setState({
            menu: !this.state.menu
        });
    }

    checkIn() {
        console.log('check in');
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

        const showLink = route('shows.single', { title: item[item.itemType].ids.slug });
        let link = null;
        if(item.next_episode) {
            link = route('show.episode', { title: item[item.itemType].ids.slug, season: item.next_episode.season, episode: item.next_episode.number });
        }

        return (
            <div
                className={classNames('poster', {
                    'poster--progressing': progressing
                })}
            >
                <div className="poster__images">
                    <Link to={link || showLink}>
                        <img src="/img/poster.png" alt="Temporary Poster" className="base" />
                        {item[item.itemType].poster_path ? (
                            <img src={item[item.itemType].poster_path} alt="Poster" className="real" />
                        ) : null}
                        {updating ? (
                            <div className="updating">
                                <Spinner type="white" size="medium" />
                            </div>
                        ) : null}
                        {item.is_new ? (
                            <div className="new-tag">
                                <div />
                            </div>
                        ) : null}
                    </Link>
                </div>
                {actions ? (
                    <div className="poster__actions">
                        {allowHistory ? (
                            <button className="history" onClick={this.history.bind(this, null)}>
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
                        {allowMenu ? (
                            <Dropdown
                                dark={true}
                                menu={(
                                    <Menu placement="right">
                                        <Item onClick={this.checkIn.bind(this)} disabled={true}>Check in</Item>
                                        <Item onClick={this.watchedAt.bind(this)}>Watched at...</Item>
                                        <Item onClick={this.toggleHide.bind(this)}>{item.is_hidden ? 'Unhide this' : 'Hide this'}</Item>
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
                        {item.next_episode ? (
                            <p>
                                <Link to={link}>
                                    <span className="titles__number">
                                        {item.next_episode.season + 'x' + item.next_episode.number}
                                    </span>
                                    <span
                                        className="titles__name"
                                        dangerouslySetInnerHTML={{__html: item.next_episode.title }}
                                    />
                                </Link>
                            </p>
                        ) : null}
                        <p
                            className={classNames('titles__show', {
                                'titles--single': !item.next_episode
                            })}
                        >
                            <Link to={showLink} dangerouslySetInnerHTML={{__html: item[item.itemType].title }} />
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
