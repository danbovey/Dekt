import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as authActions from 'actions/auth';

@connect(
    state => ({
        config: state.config
    }),
    dispatch => ({
        authActions: bindActionCreators(authActions, dispatch)
    })
)
export default class OAuthCallback extends Component {
    componentDidMount() {
        const code = getQueryStringValue('code');
        if(code) {
            this.props.authActions.init(this.props.config);
            this.props.authActions.exchange(code)
                .then(() => window.close());
        } else {
            window.close();
        }
    }

    render() {
        return (
            <p>Saving details...</p>
        );
    }
}

const getQueryStringValue = key => decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" +
    encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
