const { transformURL, trimSlashes, parseQuery } = require('./utils');

/**
 * Route navigator for browser
 * @template RouteOptions
 * @template RouteState 
 */
class RouteNavigator {
  /**
   * Instance of Router class 
   * @type {import('./router').Router<RouteOptions, RouteState>}
   * @protected
   */
  router;

  /**
   * Handler to process a new url
   * @type {() => void}
   * @protected
   */
  popStateHandler;

  /**
   * Instance of Router class
   * @param {import('./router').Router<RouteOptions, RouteState>} router 
   */
  constructor(router) {
    this.router = router;

    this.popStateHandler = () => {
      router.processUrl(this.fragment, this.query, history.state);
    };
  }

  /**
   * Get path fragment from the current url
   * @returns {string}
   */
  get fragment() {
    let value = decodeURI(location.pathname);
  
    if(this.router.rootPath !== '/') {
      value = value.replace(this.router.rootPath, '');
    }
  
    return trimSlashes(value);
  }

  /**
   * Get dictionary from the query string of the current url
   * @returns {{[key: string]: string}}
   */
  get query() {
    return parseQuery(location.search);
  }

  /**
   * Replace url state in the browser
   * @param {string} url 
   * @param {RouteState} state 
   */
  async redirectTo(url, state) {
    const newUrl = transformURL(url, this.fragment, this.router.rootPath);  

    history.replaceState(state, '', this.router.rootPath + newUrl);

    const currentPath = this.fragment;
    const currentQuery = this.query;
    
    await this.router.processUrl(currentPath, currentQuery, state);
  }

  /**
   * Add new url state into the browser 
   * @param {string} url 
   * @param {RouteState} state 
   */
  async navigateTo(url, state) {
    const newUrl = transformURL(url, this.fragment, this.router.rootPath);  
    
    history.pushState(state, '', this.router.rootPath + newUrl);

    const currentPath = this.fragment;
    const currentQuery = this.query;
    
    await this.router.processUrl(currentPath, currentQuery, state);
  }

  /**
   * Refresh the browser
   */
  async refresh() {
    return this.redirectTo(this.fragment + location.search, history.state);
  } 

  /**
   * Listen 'popstate' event
   */
  addUriListener() {
    window.addEventListener('popstate', this.popStateHandler);
  }

  /**
   * Unlisten 'popstate' event
   */
  removeUriListener() {
    window.removeEventListener('popstate', this.popStateHandler);
  }
}

module.exports = {
  RouteNavigator
};
