import React from 'react';

import route from 'helpers/route';

import './styles';

const Navbar = () => (
    <header className="navbar">
        <a href={route('home')} className="logo">
            <img src="/img/logo.png" alt="Trakt.tv" />
            <div className="bottom-wrapper">
                <div className="bottom" />
            </div>
        </a>
        <ul className="nav nav--left">
            <li><a href="/shows/trending">TV</a></li>
            <li><a href="/movies/trending">Movies</a></li>
            <li><a href="/calendars">Calendar</a></li>
        </ul>
        <ul className="nav nav--right">
            <li><a href="/discover">Discover</a></li>
            <li><a href="/apps">Apps</a></li>
            <li><a href="/vip">VIP</a></li>
        </ul>
    </header>
);

export default Navbar;
