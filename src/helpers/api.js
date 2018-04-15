import Trakt from 'trakt.tv';

const port = window.location.port ? ':' + window.location.port : '';
const app_url = `${window.location.protocol}//${window.location.hostname}${port}`;

const api = {
  client: new Trakt({
    client_id: process.env.REACT_APP_TRAKT_CLIENT_ID,
    client_secret: process.env.REACT_APP_TRAKT_CLIENT_SECRET,
    redirect_uri: app_url + '/oauth/callback',
    // api_url: 'https://api-staging.trakt.tv'
  }),
  getAuthUrl: () => api.client.get_url(),
  exchange: code =>
    api.client.exchange_code(code)
      .then(result => {
        localStorage.setItem('trakt.access_token', result.access_token);
        localStorage.setItem('trakt.refresh_token', result.refresh_token);
        localStorage.setItem(
          'trakt.expires',
          (result.created_at + result.expires_in) * 1000
        );
      })
};

/**
 * Import or refresh Trakt tokens
 */
export const init = () => {
  const tokens = {
    access_token: localStorage.getItem('trakt.access_token'),
    refresh_token: localStorage.getItem('trakt.refresh_token'),
    expires: localStorage.getItem('trakt.expires'),
  };
  if (tokens.access_token) {
    return api.client.import_token(tokens)
      .then(newTokens => {
        if (typeof newTokens.access_token !== 'undefined') {
          localStorage.setItem('trakt.access_token', newTokens.access_token);
          localStorage.setItem('trakt.refresh_token', newTokens.refresh_token);
          localStorage.setItem('trakt.expires', newTokens.expires);
        }
      });
  }
  return Promise.reject();
};
init().catch(() => {});

export default api;
