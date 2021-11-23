class Router {
  routes = [];
  root = '/';
  before;
  page404;

  constructor(options) {
    if(options?.root) {
      this.root = options.root === '/' ? '/' : '/' + this.trimSlashes(options.root) + '/';
    }

    if(typeof options?.before === 'function') {
      this.before = options.before;
    }

    if(typeof options?.page404 === 'function') {
      this.page404 = options.page404;
    }

    if(options?.routes?.length > 0) {
      options.routes.forEach(route => {
        this.add(route.rule, route.handler, route.options);
      });
    }
  }

  get fragment() {
    let value = decodeURI(location.pathname);

    if(this.root !== '/') {
      value = value.replace(this.root, "");
    }

    return this.trimSlashes(value);
  }

  get query() {
    return this.parseQuery(location.search);
  }

  add(rule, handler, options) {
    this.routes.push({
      rule: this.parseRouteRule(rule),
      handler,
      options
    });

    return this;
  }

  remove(param) {
    if(typeof param === 'string') {
      param = this.parseRouteRule(param);
    }

    this.routes.some((route, i) => {
      if(route.handler === param || route.rule === param) {
        this.routes.splice(i, 1);

        return true;
      }

      return false;
    });


    return this;
  }

  redirectTo(path, state) {
    path = this.trimSlashes(path);

    history.replaceState(state, null, this.root + path);

    this.processUri();

    return this;
  }

  navigateTo(path, state) {
    path = this.trimSlashes(path);

    history.pushState(state, null, this.root + path);

    this.processUri();

    return this;
  }

  refresh() {
    return this.redirectTo(this.fragment + location.search, history.state);
  }

  trimSlashes(path) {
    if(typeof path !== 'string') {
      return '';
    }
    
    return path.replace(/\/$/, '').replace(/^\//, '');
  }

  parseRouteRule(route) {
    if(typeof route !== "string") {
      return route;
    }

    let uri = this.trimSlashes(route);

    let rule = uri
      .replace(/([\\\/\-\_\.])/g, "\\$1")
      .replace(/\{[a-zA-Z]+\}/g, "(:any)")
      .replace(/\:any/g, "[\\w\\-\\_\\.]+")
      .replace(/\:word/g, "[a-zA-Z]+")
      .replace(/\:num/g, "\\d+");

    return new RegExp("^" + rule + "$", "i");
  }

  parseQuery(query) {
    let data = {};

    if(typeof query !== "string") {
      return data;
    }

    if(query[0] === '?') {
      query = query.substr(1);
    }

    query.split('&').forEach(row => {
      let parts = row.split('=');

      if(parts[0] !== '') {
        if(parts[1] === undefined) {
          parts[1] = true;
        }

        data[decodeURIComponent(parts[0])] = parts[1];
      }
    });

    return data;
  }

  findRoute() {
    let fragment = this.fragment;

    return this.routes.some(route => {
      let match = fragment.match(route.rule);

      if(match) {
        match.shift();

        let query = this.query;
        let page = {
          fragment,
          query,
          match,
          options: route.options
        };

        let doBreak = this.before?.(page);

        if(doBreak) {
          return false;
        }

        route.handler?.(page);

        return true;
      }

      return false;
    });
  }

  processUri() {
    let fragment = this.fragment;

    let found = this.findRoute();

    if(!found) {
      this.page404?.(fragment);
    }
  }

  addUriListener() {
    window.onpopstate = this.processUri.bind(this);
  }

  removeUriListener() {
    window.onpopstate = null;
  }
}

exports.Router = Router;