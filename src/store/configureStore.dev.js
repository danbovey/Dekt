import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../reducers';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import DevTools from '../containers/DevTools';

const logger = createLogger({
    level: 'info',
    collapsed: true,
    timestamp: false,
    predicate: (getState, action) => typeof action != 'undefined' && action.type !== 'IGNORE' && action.type !== 'WATCHING_CLEAR'
});

export default function configureStore(initialState, history) {
    const finalCreateStore = compose(
        // Middleware you want to use in development:
        applyMiddleware(logger, thunk),
        window.devToolsExtension ? window.devToolsExtension() : DevTools.instrument(),
    )(createStore);

    const store = finalCreateStore(rootReducer, initialState);

    // Hot reload reducers (requires Webpack or Browserify HMR to be enabled)
    if (module.hot) {
        module.hot.accept('../reducers', () =>
            store.replaceReducer(require('../reducers'))
        );
    }

    return store;
};
