/**
 * Based on the current environment variable, we need to make sure
 * to exclude any DevTools-related code from the production builds.
 * The code is envify'd - using 'DefinePlugin' in Webpack.
 */

let loadedStore = null;

import devStore from './configureStore.dev';
import prodStore from './configureStore.prod';

if (process.env.NODE_ENV === 'production') {
    loadedStore = prodStore;
} else {
    loadedStore = devStore;
}

export const configureStore = loadedStore;
