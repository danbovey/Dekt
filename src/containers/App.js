import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';

import * as configActions from 'actions/config';
import * as lightActions from 'actions/lights';
import Navbar from 'components/Navbar';
import Spinner from 'components/Spinner';

import 'app.scss';

@connect(
    state => ({
        config: state.config,
        lights: state.lights.on
    }),
    dispatch => ({
        configActions: bindActionCreators(configActions, dispatch),
        lightActions: bindActionCreators(lightActions, dispatch)
    })
)
export default class App extends Component {
    componentWillMount() {
        const config = this.props.config;
        if(!config.loaded || config.failed) {
            this.props.configActions.load();
        }
    }

    lightsOff() {
        this.props.lightActions.off();
    }

    render() {
        const {
            children,
            config,
            lights
        } = this.props;

        if(!config.loaded) {
            return (
                <div className="container container--app-load">
                    <Spinner size="large" />
                </div>
            );
        }

        if(config.failed) {
            return (
                <div className="container container--app-load">
                    <p className="error">Failed to load <code>config.json</code></p>
                </div>
            );
        }

        return (
            <div
                className={classNames({
                    'cinematic-lighting': lights
                })}
            >
                <Navbar />
                <div
                    className="cinematic-lighting-bg"
                    onClick={this.lightsOff.bind(this)}
                />
                {children}
            </div>
        );
    }
}
