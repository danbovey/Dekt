import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import classNames from 'classnames';

import * as configActions from 'actions/config';
import * as lightActions from 'actions/lights';
import Navbar from 'components/Navbar';

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

    toggleLighting() {
        this.props.lightActions.toggle();
    }

    render() {
        const {
            children,
            config,
            lights
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
            <div
                className={classNames({
                    'cinematic-lighting': lights
                })}
            >
                <Navbar />
                <div
                    className="cinematic-lighting-bg"
                    onClick={this.toggleLighting.bind(this)}
                />
                {children}
            </div>
        );
    }
}
