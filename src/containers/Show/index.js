import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import classNames from 'classnames';

import * as showActions from 'actions/show';
import PageTopper from 'components/PageTopper';
import Poster from 'components/Poster';
import Spinner from 'components/Spinner';
import Icon from 'components/Icon';

import './styles';

@connect(
    state => ({
        show: state.show,
        deck: state.deck
    }),
    dispatch => ({
        showActions: bindActionCreators(showActions, dispatch)
    })
)
export default class Show extends Component {
    componentWillMount() {
        const show = this.props.show;
        const title = this.props.params.title;

        if((!show.item || title != show.item.title) && show.loading == false) {
            this.props.showActions.load(title);
        }
    }

    componentDidUpdate(prevProps) {
        const title = this.props.params.title;
        const show = this.props.show;
        
        if(show.item) {
            if(show.seasons == null && show.seasons_loading == false) {
                this.props.showActions.loadSeasons(title);
            }
            if(show.progress == null && show.progress_loading == false) {
                this.props.showActions.loadProgress(title, this.props.deck);
            }
        }
    }

    render() {
        // const item = this.props.show.item;
        // const seasons = this.props.show.seasons;
        // const progress = this.props.show.progress;
        const {
            show: {
                item,
                seasons,
                progress
            }
        } = this.props;

        let stats = [];
        if(item && item.show.stats) {
            stats = [
                { name: 'watchers' },
                { name: 'plays' },
                { name: 'collected_episodes', label: 'collected' },
                { name: 'lists' }
            ];
        }

        let additional = [];
        if(item) {
            additional = [
                { label: 'Airs', value: `${item.show.airs.day} at ${moment(item.show.airs.time, 'HH:mm').format('hh:mm A')} on ${item.show.network}` },
                { label: 'Premiered', value: moment(item.show.first_aired).format('MMM D, YYYY') },
                { label: 'Runtime', value: `${item.show.runtime} min${item.show.runtime != 1 ? 's' : ''}` },
                { label: 'Language', value: item.show.language },
                { label: 'Genres', value: item.show.genres.map(genre => genre.upperCaseFirst()).join(', ') }
            ];
        }

        let currentSeason = null;
        if(seasons && progress) {
            // Find the furthest season that's been watched
            currentSeason = progress.seasons.find(s => s.number == 1);
            progress.seasons.forEach(season => {
                if(season.completed > 0 && season.aired > season.completed) {
                    currentSeason = season;
                }
            });
            if(currentSeason) {
                currentSeason.episodes = currentSeason.episodes.map(episode => {
                    const episodeDetail = seasons.find(s => s.number == currentSeason.number)
                        .episodes.find(e => e.number == episode.number);

                    episodeDetail.completed = episode.completed;
                    episodeDetail.last_watched_at = episode.last_watched_at;
                    return episodeDetail;
                });
            }
        }

        return (
            <main className="show">
                {item ? (
                    <div>
                        <PageTopper item={item}>
                            <div className="container">
                                <h2>
                                    {item.show.title}
                                    <span className="year">{item.show.year}</span>
                                </h2>
                                <div className="show__meta">
                                    {item.show.rating && item.show.votes ? (
                                        <div className="rating">
                                            <Icon name="heart" />
                                            <p>
                                                {`${Math.round(item.show.rating * 10)}%`}
                                                <span>{`${item.show.votes} votes`}</span>
                                            </p>
                                        </div>
                                    ) : null}
                                    {stats.map((stat, i) => (
                                        <div className={stat.name} key={i}>
                                            <p>{item.show.stats[stat.name]}<span>{stat.label || stat.name}</span></p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </PageTopper>
                        <div className="show-main">
                            <div className="container">
                                <aside className="sidebar">
                                    <Poster item={item} titles={false} />
                                </aside>
                                <div className="show-content">
                                    <section className="overview">
                                        <ul className="additional-stats">
                                            {additional.map((stat, i) => (
                                                <li key={i}>
                                                    <label>{stat.label}</label>
                                                    <span>{stat.value}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <p>{item.show.overview}</p>
                                    </section>
                                    {item.show.usersWatching ? (
                                        <section className="watching-now">
                                            <p>{item.show.usersWatching.length} watching now</p>
                                            <div className="users">
                                                {item.show.usersWatching.slice(0, item.show.usersWatching.length > 10 ? 9 : 10).map((user, i) => (
                                                    <a href={`https://trakt.tv/users/${user.username}`} target="_blank" rel="noopener" key={i}>
                                                        <img src={user.images ? user.images.avatar.full : null} alt={user.username} />
                                                    </a>
                                                ))}
                                                {item.show.usersWatching.length > 10 ? (
                                                    <a href="#" className="plus-more">+{item.show.usersWatching.length - 9} more</a>
                                                ) : null}
                                            </div>
                                        </section>
                                    ) : null}
                                    {currentSeason ? (
                                        <table className="table">
                                            <tbody>
                                                {currentSeason.episodes.map((episode, i) => (
                                                    <tr key={i}>
                                                        <td>{episode.number}</td>
                                                        <td>{episode.title}</td>
                                                        <td className="date">{moment(episode.first_aired).format('MMM DD, YYYY')}</td>
                                                        <td>
                                                            <button className="btn btn--history">
                                                                <Icon name="check" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <Spinner size="large" />
                )}
            </main>
        );
    }
}
