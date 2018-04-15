import React, { Component } from 'react';

import api from '../../helpers/api';
import queryString from '../../helpers/query-string';

class OAuthCallback extends Component {
  componentDidMount() {
    const code = queryString('code');
    if (code) {
      console.log('mounting and exchanging!!!!');
      api.exchange(code).then(() => window.close());
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

export default OAuthCallback;