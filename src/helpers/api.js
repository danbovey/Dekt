import Trakt from 'trakt.tv';

const api = {
    client: null,
    init: (config) => {
        const app_url = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
        
        api.client = new Trakt({
            client_id: config.client_id,
            client_secret: config.client_secret,
            redirect_uri: app_url + '/oauth/callback',
            api_url: 'https://api.trakt.tv'
        });

        const tokens = {
            access_token: localStorage.getItem('trakt.access_token'),
            refresh_token: localStorage.getItem('trakt.refresh_token'),
            expires: localStorage.getItem('trakt.expires'),
        };
        if(tokens.access_token) {
            api.client.import_token(tokens).then(newTokens => {
                if(typeof newTokens.access_token != 'undefined') {
                    localStorage.setItem('trakt.access_token', newTokens.access_token);
                    localStorage.setItem('trakt.refresh_token', newTokens.refresh_token);
                    localStorage.setItem('trakt.expires', newTokens.created_at + newTokens.expires_in);
                }
            });
        }
    },
    getAuthUrl: () => api.client.get_url(),
    exchange: (code) => {
        return api.client.exchange_code(code)
            .then(result => {
                localStorage.setItem('trakt.access_token', result.access_token);
                localStorage.setItem('trakt.refresh_token', result.refresh_token);
                localStorage.setItem('trakt.expires', result.created_at + result.expires_in);
            });
    }
};

export default api;
