import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import * as authActions from 'actions/auth';
import Home from 'containers/Home';
import Spinner from 'components/Spinner';

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

        this.checkIsHome();
    }

    componentDidUpdate(prevProps) {
        this.checkIsHome();
    }

    checkIsHome() {
        const {
            auth
        } = this.props;

        if(auth.loaded && !auth.user) {
            browserHistory.push('/');
        }
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

    render() {
        const {
            auth,
            children
        } = this.props;

        if(auth.oauthStarted || (!auth.loaded && auth.loading) || !auth.user) {
            if(!auth.loaded && auth.loading) {
                return (
                    <div className="container container--app-load">
                        <Spinner size="large" />
                    </div>
                );
            } else {
                return <Home checkAuth={this.checkAuth.bind(this)} />
            }
        } else {
            return children;
        }
    }
}
