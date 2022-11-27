/**
 * Remove slashes from the begin and end of the path
 * @param {string} path
 * @returns {string}
 */
export function trimSlashes(path: string): string;
/**
 * Transform url for Router class
 * @param {string} url
 * @param {string} currentPath
 * @param {string} root
 * @returns {string}
 */
export function transformURL(url: string, currentPath: string, root: string): string;
/**
 * Parse the query string and return a dictionary
 * @param {string} query
 * @returns {{[key: string]: string}}
 */
export function parseQuery(query: string): {
    [key: string]: string;
};
/**
 * Parse the route string and return RegExp
 * @param {string | RegExp} route
 * @returns {RegExp}
 */
export function parseRouteRule(route: string | RegExp): RegExp;
