import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import classNames from 'classnames';

import * as showActions from 'actions/show';
import Icon from 'components/Icon';
import Spinner from 'components/Spinner';
import route from 'helpers/route';

import './styles';

@connect(
    state => ({}),
    dispatch => ({
        showActions: bindActionCreators(showActions, dispatch)
    })
)
export default class Poster extends Component {
    static defaultProps = {
        allowHistory: true,
        allowWatchlist: true
    };

    constructor(props) {
        super(props);

        this.state = {
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

    history() {
        // TOOD: If this item is in history
        this.setState({
            progressing: true,
            updating: true,
        });
        this.props.showActions.progressWatched(this.props.item)
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

    render() {
        const {
            actions,
            allowHistory,
            allowWatchlist,
            item
        } = this.props;

        const {
            progressing,
            updating
        } = this.state;

        const link = route('shows.single', { title: item[item.itemType].ids.slug });

        return (
            <div
                className={classNames('poster', {
                    'poster--progressing': progressing
                })}
            >
                <div className="poster__images">
                    <Link to={link}>
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
                            <button className="history" onClick={this.history.bind(this)}>
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
                    </div>
                ) : null}
                <div className="poster__titles">
                    {item.next_episode ? (
                        <p>
                            <span className="titles__number">{item.next_episode.season + 'x' + item.next_episode.number}</span>
                            <span
                                className="titles__name"
                                dangerouslySetInnerHTML={{__html: item.next_episode.title }}
                            />
                        </p>
                    ) : null}
                    <p
                        className={classNames('titles__show', {
                            'titles--single': !item.next_episode
                        })}
                        dangerouslySetInnerHTML={{__html: item[item.itemType].title }}
                    />
                </div>
            </div>
        );
    }
}
