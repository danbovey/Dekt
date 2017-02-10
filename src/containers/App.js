import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as configActions from 'actions/config';
import Navbar from 'components/Navbar';

import 'app.scss';

@connect(
    state => ({
        config: state.config
    }),
    dispatch => ({
        configActions: bindActionCreators(configActions, dispatch)
    })
)
export default class App extends Component {
    componentWillMount() {
        const config = this.props.config;
        if(!config.loaded || config.failed) {
            this.props.configActions.load();
        }
    }

    render() {
        const {
            children,
            config
        } = this.props;

        if(config.failed) {
            return <p>Failed to load <code>config.json</code></p>;
        }

        if(!config.loaded) {
            return (
                <div>
                    Loading...
                </div>
            );
        }

        return (
            <div>
                <Navbar />
                {children}
            </div>
        );
    }
}
