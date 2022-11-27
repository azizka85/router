/**
 * Route navigator for browser
 * @template RouteOptions
 * @template RouteState
 */
export class RouteNavigator<RouteOptions, RouteState> {
    /**
     * Instance of Router class
     * @param {import('./router').Router<RouteOptions, RouteState>} router
     */
    constructor(router: import('./router').Router<RouteOptions, RouteState>);
    /**
     * Instance of Router class
     * @type {import('./router').Router<RouteOptions, RouteState>}
     * @protected
     */
    protected router: import('./router').Router<RouteOptions, RouteState>;
    /**
     * Handler to process a new url
     * @type {() => void}
     * @protected
     */
    protected popStateHandler: () => void;
    /**
     * Get path fragment from the current url
     * @returns {string}
     */
    get fragment(): string;
    /**
     * Get dictionary from the query string of the current url
     * @returns {{[key: string]: string}}
     */
    get query(): {
        [key: string]: string;
    };
    /**
     * Replace url state in the browser
     * @param {string} url
     * @param {RouteState} state
     */
    redirectTo(url: string, state: RouteState): Promise<void>;
    /**
     * Add new url state into the browser
     * @param {string} url
     * @param {RouteState} state
     */
    navigateTo(url: string, state: RouteState): Promise<void>;
    /**
     * Refresh the browser
     */
    refresh(): Promise<void>;
    /**
     * Listen 'popstate' event
     */
    addUriListener(): void;
    /**
     * Unlisten 'popstate' event
     */
    removeUriListener(): void;
}
