import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Tooltip from 'rc-tooltip';
import moment from 'moment';
import classNames from 'classnames';

import * as showActions from 'actions/show';
import * as syncActions from 'actions/sync';
import Button from 'components/Button';
import Dropdown, { Menu, Item, Divider } from 'components/Dropdown';
import Spinner from 'components/Spinner';
import Icon from 'components/Icon';

import './styles';

@connect(
    state => ({}),
    dispatch => ({
        showActions: bindActionCreators(showActions, dispatch),
        syncActions: bindActionCreators(syncActions, dispatch),
    })
)
export default class EpisodeList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            season: null
        };
    }

    componentWillMount() {
        const show = this.props.show;

        if(show.seasons == null && show.seasons_loading == false) {
            this.props.showActions.loadSeasons(show.item.show.ids.slug);
        }
        if(show.progress == null && show.progress_loading == false) {
            this.props.showActions.loadProgress(show.item.show.ids.slug);
        }
    }

    selectSeason(season) {
        this.setState({ season });
    }

    toggleHistory(trakt_id) {
        this.props.syncActions.history(trakt_id);
    }

    render() {
        const {
            show: {
                seasons,
                progress
            }
        } = this.props;

        const season = this.state.season;

        let currentSeason = null;
        if(seasons && progress) {
            currentSeason = progress.seasons.find(s => s.number == season);
            // If we have no selection for season then find the furthest season watched
            if(currentSeason == null) {
                currentSeason = progress.seasons.find(season => season.aired > season.completed);
            }
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

        if(currentSeason) {
            const numberedSeasons = seasons ? seasons.filter(s => s.number != 0) : [];
            const specials = seasons.find(s => s.number == 0);

            return (
                <div className="episode-list">
                    <Dropdown
                        menu={(
                            <Menu placement="right">
                                {numberedSeasons.map((season, i) => (
                                    <Item onClick={this.selectSeason.bind(this, season.number)} key={i}>
                                        Season {season.number}
                                    </Item>
                                ))}
                                {specials ? (
                                    <Divider />
                                ) : null}
                                {specials ? (
                                    <Item onClick={this.selectSeason.bind(this, specials.number)}>
                                        Specials
                                    </Item>
                                ) : null}
                            </Menu>
                        )}
                    >
                        <Button type="default" className="btn--season-selector">
                            <span>{currentSeason.number > 0 ? `Season ${currentSeason.number}` : 'Specials'}</span>
                            <Icon name="angle-down" />
                        </Button>
                    </Dropdown>
                    <table className="table">
                        <tbody>
                            {currentSeason.episodes.map((episode, i) => (
                                <tr key={i}>
                                    <td>{episode.number}</td>
                                    <td>{episode.title}</td>
                                    <td className="date">{moment(episode.first_aired).format('MMM DD, YYYY')}</td>
                                    <td>
                                        <Tooltip
                                            placement="right"
                                            transitionName="rc-tooltip-zoom"
                                            overlay={<span>Add to History</span>}
                                            mouseLeaveDelay={0}
                                        >
                                            <Button
                                                type="history"
                                                onClick={this.toggleHistory.bind(this, episode.ids.trakt)}
                                                className={classNames({
                                                    'active': episode.completed
                                                })}
                                            >
                                                <Icon name="check" />
                                            </Button>
                                        </Tooltip>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }

        return (
            <div className="episode-list">
                <Spinner size="medium" />
            </div>
        );
    }
}
