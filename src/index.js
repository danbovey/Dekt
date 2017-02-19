import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, browserHistory } from 'react-router';
import ReduxSweetAlert from 'react-redux-sweetalert';
import ReactGA from 'react-ga';

__webpack_public_path__ = "http://localhost:3000/build/";

import 'babel-polyfill';
import 'prototypes';
import { configureStore } from 'store/configureStore';
import DevTools from 'containers/DevTools';
import getRoutes from 'routes';

import './sw/register';

ReactGA.initialize('UA-26369727-6');

const dest = document.getElementById('root');
const store = configureStore();

const logPageView = () => {
    ReactGA.set({ page: window.location.pathname });
    ReactGA.pageview(window.location.pathname);
};

const router = (
    <Router
        onUpdate={(prevState, nextState) => {
            // If the transition is not "back"
            if(nextState && nextState.location.action !== "POP") {
                window.scrollTo(0, 0);
            }
            logPageView();
        }}
        history={browserHistory}
    >
        {getRoutes(store)}
    </Router>
);

if(typeof process.env.NODE_ENV != 'undefined' && process.env.NODE_ENV == 'development') {
    ReactDOM.render(
        <Provider store={store} key="provider">
            <div>
                {router}
                <DevTools />
                <ReduxSweetAlert />
            </div>
        </Provider>,
        dest
    );
} else {
    ReactDOM.render(
        <Provider store={store} key="provider">
            <div>
                {router}
                <ReduxSweetAlert />
            </div>
        </Provider>,
        dest
    );
}
