import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Tooltip from 'rc-tooltip';
import moment from 'moment';
import classNames from 'classnames';

import * as showActions from 'actions/show';
import PageTopper from 'components/PageTopper';
import Poster from 'components/Poster';
import Button from 'components/Button';
import Spinner from 'components/Spinner';
import Icon from 'components/Icon';
import UsersWatching from 'components/UsersWatching';
import EpisodeList from 'components/EpisodeList';
import { formatNumber } from 'helpers/number';

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

        // If the show has changed
        if((!show.item || title.toLowerCase() != show.item[show.item.itemType].title.toLowerCase()) && show.loading == false) {
            this.props.showActions.load(title);
        }
    }

    render() {
        const title = decodeURIComponent(this.props.params.title).replace(/-/g, ' ');
        const show = this.props.show;
        const item = show.item;

        let stats = [];
        if(item && item.show.stats) {
            stats = [
                { label: 'watchers', value: formatNumber(item.show.stats.watchers) },
                { label: 'plays', value: formatNumber(item.show.stats.plays) },
                { label: 'collected', value: formatNumber(item.show.stats.collected_episodes) },
                { label: 'lists', value: formatNumber(item.show.stats.lists) }
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

        return (
            <main className="show">
                <PageTopper item={item}>
                    <div className="container">
                        <h2>
                            <span dangerouslySetInnerHTML={{__html: item ? item.show.title : title }} />
                            <span className="year">{item ? item.show.year : null}</span>
                        </h2>
                        <div className="show__meta">
                            {item && item.show.rating && item.show.votes ? (
                                <div className="rating">
                                    <Icon name="heart" />
                                    <span className="heart-solid" />
                                    <p>
                                        {`${Math.round(item.show.rating * 10)}%`}
                                        <span>{`${item.show.votes} votes`}</span>
                                    </p>
                                </div>
                            ) : null}
                            {stats.map((stat, i) => (
                                <div key={i}>
                                    <p>{stat.value}<span>{stat.label}</span></p>
                                </div>
                            ))}
                        </div>
                    </div>
                </PageTopper>
                <div className="show-main">
                    {item ? (
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
                                <section className="watching-now">
                                    <UsersWatching show={show} />
                                </section>
                                <section className="seasons">
                                    <EpisodeList show={show} />
                                </section>
                            </div>
                        </div>
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
