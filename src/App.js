import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import loadable from 'loadable-components';
import Alert from 'react-s-alert';

import store from './store';
import Header from './components/Header';
import './App.css';

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
