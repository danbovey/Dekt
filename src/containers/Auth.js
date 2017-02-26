import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

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
