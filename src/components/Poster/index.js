import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';

import * as showActions from 'actions/show';
import Icon from 'components/Icon';
import Spinner from 'components/Spinner';

import './styles';

@connect(
    state => ({}),
    dispatch => ({
        showActions: bindActionCreators(showActions, dispatch)
    })
)
export default class Poster extends Component {
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
            item
        } = this.props;

        const {
            progressing,
            updating
        } = this.state;

        return (
            <div
                className={classNames('poster', {
                    'poster--progressing': progressing
                })}
            >
                <div className="poster__images">
                    <img src="/img/poster.png" alt="Temporary Poster" className="base" />
                    <img src={item.poster_path} alt="Poster" className="real" />
                    {updating ? (
                        <div className="updating">
                            <Spinner type="white" size="medium" />
                        </div>
                    ) : null}
                </div>
                {actions ? (
                    <div className="poster__actions">
                        <button className="history" onClick={this.history.bind(this)}>
                            <Icon name="check" />
                        </button>
                        {/*<button className="collect">
                            <Icon name="book" />
                        </button>*/}
                        <button
                            onClick={this.watchlist.bind(this)}
                            className={classNames('list', {
                                'active': item.user && item.user.watchlist
                            })}
                        >
                            <Icon name="align-left" />
                        </button>
                        {/*<button className="watch-now">
                            <Icon name="play" />
                        </button>*/}
                    </div>
                ) : null}
                <div className="poster__titles">
                    <p>
                        <span className="titles__number">{item.next_episode.season + 'x' + item.next_episode.number}</span>
                        <span
                            className="titles__name"
                            dangerouslySetInnerHTML={{__html: item.next_episode.title }}
                        />
                    </p>
                    <p
                        className="titles__show"
                        dangerouslySetInnerHTML={{__html: item.show.title }}
                    />
                </div>
            </div>
        );
    }
}
