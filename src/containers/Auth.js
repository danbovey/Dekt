import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as authActions from 'actions/auth';

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

        if(!auth.loaded) {
            return (
                <div>
                    Loading...
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
