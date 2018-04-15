import React from 'react';
import { applyMiddleware, compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import loadable from 'loadable-components';
import Alert from 'react-s-alert';

import rootReducer from './reducers';
import Header from './components/Header';
import { USER_WATCHING_CLEAR } from './constants/user';
import './App.css';

const logger = createLogger({
  level: 'info',
  collapsed: true,
  timestamp: false,
  predicate: (getState, action) =>
    typeof action.type !== 'undefined' && action.type !== USER_WATCHING_CLEAR
});
const finalCreateStore = compose(
  applyMiddleware(logger, thunk)
  // TODO: Redux DevTools here
)(createStore);

// Check if we've got a cached version of the user
let user = localStorage.getItem('trakt.user');
if(user) {
  user = JSON.parse(user);
}
const initialState = { auth: { user } };

const store = finalCreateStore(rootReducer, initialState);

const Deck = loadable(() => import('./containers/Deck/index'));
const OAuthCallback = loadable(() => import('./containers/OAuthCallback/index'));

const App = () => (
  <Provider store={store}>
    <Router>
      <div className="app">
        <Header />
        <Switch>
          <Route exact path="/" component={Deck} />
          <Route path="/oauth/callback" component={OAuthCallback} />
        </Switch>
        <Alert
          stack={{ limit: 3 }}
          html={true}
          effect="jelly"
          position="bottom-right"
        />
      </div>
    </Router>
  </Provider>
);

export default App;
