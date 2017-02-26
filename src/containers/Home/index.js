import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as authActions from 'actions/auth';
import Button from 'components/Button';
import api from 'helpers/api';

import './styles';

const Home = ({ checkAuth }) => {
    let popoutWindow;
    const backdrops = ['iron-fist', 'sherlock', 'suits', 'sunny', 'unfortunate-events'];
    const backdrop = backdrops[Math.floor(Math.random() * backdrops.length)];

    const openPopup = () => {
        if(!popoutWindow) {
            popoutWindow = window.open(api.getAuthUrl(), 'Trakt OAuth', 'width=450,height=600');
            if(popoutWindow) {
                popoutWindow.onbeforeunload = popoutClosed;
                window.addEventListener('unload', closeWindow);
            }
        }
    }

    const closeWindow = () => {
        popoutWindow && popoutWindow.close();
        window.removeEventListener('unload', closeWindow);
        popoutWindow = null;
    }

    const popoutClosed = () => {
        window.setTimeout(() => {
            checkAuth();
        }, 1000);
    }

    return (
        <main className="home">
            <section className="landing">
                <div className="background" style={{
                        backgroundImage: `url(/img/${backdrop}.webp)`
                    }}
                />
                <div className="container">
                    <h2>Automatically track the TV shows you're watching</h2>
                    <p>A client for Trakt.tv which displays your progress on current and upcoming TV shows</p>
                    <Button
                        type="primary"
                        onClick={openPopup}
                    >
                        Connect with Trakt.tv
                    </Button>
                </div>
            </section>
            <section className="screenshot">
                <div className="container">
                    <img src="/img/early-screenshot.jpg" />
                </div>
            </section>
            <footer className="footer">
                <div className="container">
                    <p>Uses the Trakt API but is not endorsed or affiliated by Trakt.tv.</p>
                    <iframe src="https://ghbtns.com/github-btn.html?user=danbovey&repo=Dekt&type=star&count=true&size=large" frameBorder="0" scrolling="0" width="115px" height="30px"></iframe>
                </div>
            </footer>
        </main>
    );
};

export default connect(
    state => ({
        auth: state.auth,
        config: state.config
    }),
    dispatch => ({
        authActions: bindActionCreators(authActions, dispatch)
    })
)(Home);
