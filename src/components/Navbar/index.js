import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import classNames from 'classnames';

import * as lightActions from 'actions/lights';
import Icon from 'components/Icon';
import route from 'helpers/route';

import './styles';

@connect(
    state => ({
        auth: state.auth,
        lights: state.lights
    }),
    dispatch => ({
        lightActions: bindActionCreators(lightActions, dispatch)
    })
)
export default class Navbar extends Component {
    search() {

    }

    toggleLights() {
        console.log('toggle lights?');
        this.props.lightActions.toggle();
    }

    lightsOff() {
        this.props.lightActions.off();
    }

    render() {
        const {
            auth
        } = this.props;

        return (
            <header className="navbar">
                <Link
                    to={route('home')}
                    className="logo"
                    onClick={this.lightsOff.bind(this)}
                >
                    <img src="/img/logo.svg" alt="Trakt.tv" />
                    <div className="bottom-wrapper">
                        <div className="bottom" />
                    </div>
                </Link>
                <ul className="nav nav--left">
                    <li><Link
                        to={route('home')}
                        activeClassName="active"
                        onClick={this.lightsOff.bind(this)}
                    >
                        Deck
                    </Link></li>
                    <li><Link
                        to="upcoming"
                        activeClassName="active"
                        onClick={this.lightsOff.bind(this)}
                    >
                        Upcoming
                    </Link></li>
                </ul>
                <ul className="nav nav--right">
                    <li><Link
                        to="calendar"
                        activeClassName="active"
                        onClick={this.lightsOff.bind(this)}
                    >
                        Calendar
                    </Link></li>
                    <li><Link
                        to={route('watchlist')}
                        activeClassName="active"
                        onClick={this.lightsOff.bind(this)}
                    >
                        Watchlist
                    </Link></li>
                </ul>
                <ul className="nav nav--first">
                    <li>
                        <button onClick={this.search.bind(this)}>
                            <Icon name="search" />
                        </button>
                    </li>
                    <li>
                        <button onClick={this.toggleLights.bind(this)}>
                            <Icon name="light-bulb" />
                        </button>
                    </li>
                </ul>
                <div className="nav nav--last">
                    {auth.user ? (
                        <div className="user">
                            <a href={`https://trakt.tv/users/${auth.user.username}`} target="_blank" rel="noopener">
                                <img src={auth.user.images.avatar.full} className="avatar" alt={auth.user.name} />
                                <span>{auth.user.name}</span>
                            </a>
                        </div>
                    ) : null}
                </div>
            </header>
        );
    }
}
