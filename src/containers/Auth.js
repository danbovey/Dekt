import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as authActions from 'actions/auth';
import Spinner from 'components/Spinner';
import api from 'helpers/api';

@connect(
    state => ({
        auth: state.auth,
        config: state.config
    }),
    dispatch => ({
        authActions: bindActionCreators(authActions, dispatch)
    })
)
export default class App extends Component {
    componentWillMount() {
        this.checkAuth();
    }

    componentDidUpdate() {
        if(this.props.auth.oauthStarted && !this._popoutWindow) {
            this._popoutWindow = window.open(api.getAuthUrl(), this.props.title, 'width=450,height=600');
            if(this._popoutWindow) {
                this._popoutWindow.onbeforeunload = this.popoutClosed.bind(this);
                window.addEventListener('unload', this.closeWindow);
            }
        }
    }

    closeWindow() {
        this._popoutWindow && this._popoutWindow.close();
        window.removeEventListener('unload', this.closeWindow);
    }

    checkAuth() {
        const {
            auth,
            config
        } = this.props;

        if(!auth.loaded || !auth.user) {
            this.props.authActions.init(config);
            this.props.authActions.load();
        }
    }

    popoutClosed() {
        window.setTimeout(() => {
            this.checkAuth();
        }, 1000);
    }

    render() {
        const {
            auth,
            children
        } = this.props;

        if(auth.oauthStarted) {
            return (
                <div>
                    <p>Opening popup to authenticate with Trakt.tv</p>
                </div>
            );
        }

        if(!auth.loaded) {
            return (
                <div>
                    <Spinner size="large" />
                </div>
            );
        }

        if(!auth.user) {
            return (
                <div>User failed to load</div>
            );
        }

        return children;
    }
}

// <Popout
//                         url={api.getAuthUrl()}
//                         title="Dekt OAuth"
//                         onClosing={this.popupClosed.bind(this)}
//                         options={{width: '450px', height: '600px'}}
//                     >
//                         <p>Loading Trakt.tv...</p>
//                     </Popout>
