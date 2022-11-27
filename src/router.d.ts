/**
 * Router class to process routes
 * @template RouteOptions
 * @template RouteState
 */
export class Router<RouteOptions, RouteState> {
    /**
     * @param {import('./data/router-options').RouterOptions<RouteOptions, RouteState> | undefined} options
     */
    constructor(options?: import('./data/router-options').RouterOptions<RouteOptions, RouteState> | undefined);
    /**
     * @type {import('./data/route').Route<RouteOptions, RouteState>[]}
     * @protected
     */
    protected routes: import('./data/route').Route<RouteOptions, RouteState>[];
    /**
     * @type {string}
     * @protected
     */
    protected root: string;
    /**
     * @type {((page: import('./data/page').Page<RouteOptions, RouteState>) => Promise<boolean>) | undefined}
     * @protected
     */
    protected before: (page: import('./data/page').Page<RouteOptions, RouteState>) => Promise<boolean>;
    /**
     * @type {((page: import('./data/page').Page<RouteOptions, RouteState>) => Promise<void>) | undefined}
     * @protected
     */
    protected page404: (page: import('./data/page').Page<RouteOptions, RouteState>) => Promise<void>;
    /**
     * Get root path
     * @returns {string}
     */
    get rootPath(): string;
    /**
     * Add routes to the router
     * @param {import('./data/route').Route<RouteOptions, RouteState>[]} routes
     */
    addRoutes(routes: import('./data/route').Route<RouteOptions, RouteState>[]): void;
    /**
     * Add route to the router
     * @param {string | RegExp} rule
     * @param {((page: import('./data/page').Page<RouteOptions, RouteState>) => Promise<void>) | undefined} handler
     * @param {RouteOptions | undefined} options
     * @returns {Router<RouteOptions, RouteState>}
     */
    add(rule: string | RegExp, handler?: (page: import('./data/page').Page<RouteOptions, RouteState>) => Promise<void>, options?: RouteOptions | undefined): Router<RouteOptions, RouteState>;
    /**
     * Remove route from the router
     * @param {string | RegExp | ((page: import('./data/page').Page<RouteOptions, RouteState>) => Promise<void>)} param
     * @returns {Router<RouteOptions, RouteState>}
     */
    remove(param: string | RegExp | ((page: import('./data/page').Page<RouteOptions, RouteState>) => Promise<void>)): Router<RouteOptions, RouteState>;
    /**
     * Find route by path
     * @param {string} currentPath
     * @returns { {match: RegExpMatchArray, route: import('./data/route').Route<RouteOptions, RouteState>} | undefined }
     */
    findRoute(currentPath: string): {
        match: RegExpMatchArray;
        route: import('./data/route').Route<RouteOptions, RouteState>;
    } | undefined;
    /**
     * Find route for the current path and execute handler
     * @param {string} currentPath
     * @param {{ [key: string]: string }} currentQuery
     * @param {RouteState | undefined} state
     */
    processUrl(currentPath: string, currentQuery: {
        [key: string]: string;
    }, state?: RouteState | undefined): Promise<void>;
}
