import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as authActions from '../actions/auth';
import Home from './Home';
import Spinner from '../components/Spinner';

class Auth extends Component {
  constructor(props) {
    super(props);

    this.checkAuth = this.checkAuth.bind(this);
  }

  componentWillMount() {
    this.checkAuth();
  }

  checkAuth() {
    const { auth, authActions } = this.props;

    if (!auth.user) {
      authActions.load()
        .then(() => this.forceUpdate())
        .catch(() => {});
    }
  }

  render() {
    const { auth, children } = this.props;

    if ((!auth.loaded && auth.loading) || !auth.user) {
      if (!auth.loaded && auth.loading) {
        return (
          <div className="container container--app-load">
            <Spinner size="large" />
          </div>
        );
      } else {
        return <Home checkAuth={this.checkAuth} />
      }
    } else {
      return children;
    }
  }
}

export default connect(
  state => ({ auth: state.auth }),
  dispatch => ({ authActions: bindActionCreators(authActions, dispatch) })
)(Auth);