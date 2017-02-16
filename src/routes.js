import React from 'react';
import { IndexRoute, Route } from 'react-router';

import {
    App,
    Auth,
    Home,
    Watchlist,
    Search,
    Show,
    OAuthCallback
} from 'containers';

export const schema = {
    'home': '/',
    'watchlist': '/watchlist',
    'search': '/search',
    'shows.single': '/shows/{title}',
    'oauth.callback': '/oauth/callback'
};

export default (store) => {
    return (
        <Route component={App}>
            <Route component={Auth}>
                <Route path="/" component={Home} />
                <Route path="/watchlist" component={Watchlist} />
                <Route path="/search" component={Search} />
                <Route path="/shows/:title" component={Show} />
            </Route>
            <Route path="/oauth/callback" component={OAuthCallback} />
        </Route>
    );
};
