import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';

import * as authActions from '../../actions/auth';
import * as lights from '../../actions/lights';
import Icon from '../Icon';
import User from './User';
import Search from './Search';

import './style.css';

class Header extends Component {
  render() {
    const { lights, user } = this.props;

    return (
      <header className="app-header">
        <Link to="/" className="logo">
          <img src="/img/logo.svg" alt="Dekt" />
          <div className="bottom-wrapper">
            <div className="bottom" />
          </div>
        </Link>
        <ul className="nav nav--first">
          <Search />
          <li className="lights-toggle">
            <button onClick={lights.toggle}>
              <Icon name="light-bulb" />
            </button>
          </li>
        </ul>
        {user && (
          <div>
            <ul className="nav nav--left">
              <li>
                <NavLink to="/" onClick={lights.off}>
                  Deck
                </NavLink>
              </li>
              <li>
                <NavLink to="/upcoming" onClick={lights.off}>
                  Upcoming
                </NavLink>
              </li>
            </ul>
            <ul className="nav nav--right">
              <li>
                <NavLink to="/calendar" onClick={lights.off}>
                  Calendar
                </NavLink>
              </li>
              <li>
                <NavLink to="/watchlist" onClick={lights.off}>
                  Watchlist
                </NavLink>
              </li>
            </ul>
            <div className="nav nav--last">
              <User user={user} authActions={authActions} />
           </div>
          </div>
        )}
      </header>
    );
  }
}

export default connect(
  state => ({ user: state.auth.user }),
  dispatch => ({
    authActions: bindActionCreators(authActions, dispatch),
    lights: bindActionCreators(lights, dispatch)
  })
)(Header);