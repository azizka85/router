const { trimSlashes, parseRouteRule } = require('./utils');

class Router {
  routes = [];
  root = '/';
  before;
  page404;

  constructor(options) {
    this.before = options?.before;
    this.page404 = options?.page404;

    if(options?.root) {
      this.root = options.root === '/' ? '/' : `/${trimSlashes(options.root)}/`;
    }

    if(options?.routes) {
      this.addRoutes(options.routes);
    }
  }

  get rootPath() {
    return this.root;
  }

  addRoutes(routes) {
    for(const route of routes) {
      this.add(route.rule, route.handler, route.options);
    }
  }

  add(rule, handler, options) {
    this.routes.push({
      rule: parseRouteRule(rule),
      handler,
      options
    });

    return this;
  }

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

  async processUrl(currentPath, currentQuery, state) {
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
