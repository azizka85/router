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

  async redirectTo(url, state) {
    const newUrl = this.transformURL(url);    

    history.replaceState(state, null, this.root + newUrl);

    await this.processUri();

    return this;
  }

  async navigateTo(url, state) {
    const newUrl = this.transformURL(url);   

    history.pushState(state, null, this.root + newUrl);

    await this.processUri();

    return this;
  }

  refresh() {
    return this.redirectTo(this.fragment + location.search, history.state);
  }

  transformURL(url) {
    if(typeof url !== 'string') {
      return '';
    }

    const newUrl = url.trim();
    const splits = newUrl.split('?');

    let path = '';
    let query = '';

    if(splits.length === 1) {
      path = splits[0];
    } else {
      path = splits[0].trim();
      query = splits[1].trim();      
    }    

    if(!path) {
      path = this.fragment;
    } else {
      if(this.root !== '/') {
        path = path.replace(this.root, "");
      }

      path = this.trimSlashes(path);
    }

    if(!query) {
      return path;
    }

    return `${path}?${query}`;
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

  async findRoute() {
    const fragment = this.fragment;
    const query = this.query;

    let found = false;

    const doBreak = this.before?.({
      fragment,
      query
    });

    if(!doBreak) {
      for(let route of this.routes) {
        const match = fragment.match(route.rule);
  
        if(match) {
          match.shift();
          
          const page = {
            fragment,
            query,
            match,
            options: route.options
          };
  
          await route.handler?.(page);        
  
          found = true;
  
          break;
        }
      }      
    }    

    return found;
  }

  async processUri() {
    let fragment = this.fragment;

    let found = await this.findRoute();

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
