const { trimSlashes, parseRouteRule } = require('./utils');

/**
 * Router class to process routes
 * @template RouteOptions
 * @template RouteState
 */
class Router {
  /**
   * @type {import('./data/route').Route<RouteOptions, RouteState>[]}
   * @protected
   */
  routes = [];
  /**
   * @type {string}
   * @protected
   */
  root = '/';
  /**
   * @type {((page: import('./data/page').Page<RouteOptions, RouteState>) => Promise<boolean>) | undefined}
   * @protected
   */
  before;
  /**
   * @type {((page: import('./data/page').Page<RouteOptions, RouteState>) => Promise<void>) | undefined}
   * @protected
   */
  page404;

  /**
   * @param {import('./data/router-options').RouterOptions<RouteOptions, RouteState> | undefined} options 
   */
  constructor(options = undefined) {
    this.before = options?.before;
    this.page404 = options?.page404;

    if(options?.root) {
      this.root = options.root === '/' ? '/' : `/${trimSlashes(options.root)}/`;
    }

    if(options?.routes) {
      this.addRoutes(options.routes);
    }
  }

  /**
   * Get root path
   * @returns {string}
   */
  get rootPath() {
    return this.root;
  }

  /**
   * Add routes to the router
   * @param {import('./data/route').Route<RouteOptions, RouteState>[]} routes 
   */
  addRoutes(routes) {
    for(const route of routes) {
      this.add(route.rule, route.handler, route.options);
    }
  }

  /**
   * Add route to the router
   * @param {string | RegExp} rule 
   * @param {((page: import('./data/page').Page<RouteOptions, RouteState>) => Promise<void>) | undefined} handler 
   * @param {RouteOptions | undefined} options 
   * @returns {Router<RouteOptions, RouteState>}
   */
  add(rule, handler = undefined, options = undefined) {
    this.routes.push({
      rule: parseRouteRule(rule),
      handler,
      options
    });

    return this;
  }

  /**
   * Remove route from the router
   * @param {string | RegExp | ((page: import('./data/page').Page<RouteOptions, RouteState>) => Promise<void>)} param 
   * @returns {Router<RouteOptions, RouteState>}
   */
  remove(param) {
    this.routes.some((route, i) => {
      if(route.handler === param || route.rule === parseRouteRule(param)) {
        this.routes.splice(i, 1);

        return true;
      }

      return false;
    });
    
    return this;
  } 

  /**
   * Find route by path
   * @param {string} currentPath 
   * @returns { {match: RegExpMatchArray, route: import('./data/route').Route<RouteOptions, RouteState>} | undefined }
   */
  findRoute(currentPath) {    
    for(const route of this.routes) {
      const match = currentPath.match(route.rule);

      if(match) {
        return {
          match,
          route
        };
      }
    }
  }

  /**
   * Find route for the current path and execute handler
   * @param {string} currentPath 
   * @param {{ [key: string]: string }} currentQuery 
   * @param {RouteState | undefined} state 
   */
  async processUrl(currentPath, currentQuery, state = undefined) {
    const doBreak = await this.before?.({
      fragment: currentPath,
      query: currentQuery,
      state
    });

    if(!doBreak) {
      const found = this.findRoute(currentPath);

      if(!found) {
        await this.page404?.({
          fragment: currentPath,
          query: currentQuery,
          state
        });
      } else {
        found.match.shift();

        const page = {
          fragment: currentPath,
          query: currentQuery,
          match: found.match,
          options: found.route.options,
          state
        };

        await found.route.handler?.(page);
      }
    }
  }
}

module.exports = {
  Router
};
