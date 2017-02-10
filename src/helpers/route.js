import { schema } from 'routes';

/**
 * Build a route from the route schema
 *
 * @param name
 * @param {object} routeParams
 * @param {object} queryParams
 * @returns {string}
 */
export default (name, routeParams, queryParams) => {
    let params = '';

    let route = schema[name];

    if(!route) {
        console.error('The route `' + name + '` does not exist.');
        return '';
    }

    if(routeParams) {
        for(let param in routeParams) {
            if(routeParams.hasOwnProperty(param)) {
                route = route.replace('{' + param + '}', routeParams[param]).replace('{' + param + '?}', routeParams[param]);
            }
        }
    }

    route = route.replace(/[{]\w+[?][}]/gi, '');

    if(queryParams) {
        params += '?' + Object.keys(queryParams).map(field => field + '=' + queryParams[field]).join('&');
    }

    return route + params;
};

export const getRouteFromPath = (path) => {
    for(let name in schema) {
        if(schema[name] == path) {
            return name;
        }
    }

    console.error('No route found for `' + path + '`.');
    return '';
};
