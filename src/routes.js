import React from 'react';
import { IndexRoute, Route } from 'react-router';

import {
    App,
    Auth,
    Home,
    OAuthCallback
} from 'containers';

export const schema = {
    'home': '/',
    'oauth.callback': '/oauth/callback'
};

export default (store) => {
    return (
        <Route component={App}>
            <Route component={Auth}>
                <Route path="/" component={Home} />
            </Route>
            <Route path="/oauth/callback" component={OAuthCallback} />
        </Route>
    );
};
