/**
 * Remove slashes from the begin and end of the path
 * @param {string} path 
 * @returns {string}
 */
function trimSlashes(path) {
  return path.replace(/\/$/, '').replace(/^\//, '');
}

/**
 * Transform url for Router class
 * @param {string} url 
 * @param {string} currentPath 
 * @param {string} root 
 * @returns {string}
 */
function transformURL(url, currentPath, root) {
  const newUrl = url.trim();
  const splits = newUrl.split('?');

  let path = splits[0].trim();
  const query = splits[1]?.trim();

  if(!path) {
    path = currentPath;
  } else {
    if(root !== '/') {
      path = path.replace(root, '');
    }

    path = trimSlashes(path);
  }

  if(!query) {
    return path;
  }

  return `${path}?${query}`;
}

/**
 * Parse the query string and return a dictionary
 * @param {string} query 
 * @returns {{[key: string]: string}}
 */
function parseQuery(query) {
  const data = {};

  let search = query;

  if(query[0] === '?') {
    search = query.substring(1);
  }

  search.split('&').forEach(row => {
    const parts = row.split('=');

    if(parts[0] !== '') {
      const key = decodeURIComponent(parts[0]);
      const value = parts[1] === undefined ? '1' : parts[1];

      data[key] = value;
    }
  });

  return data;    
}

/**
 * Parse the route string and return RegExp
 * @param {string | RegExp} route 
 * @returns {RegExp}
 */
function parseRouteRule(route) {
  if(typeof route === 'string') {
    const uri = trimSlashes(route);

    const rule = uri
      .replace(/([\\\/\-\_\.])/g, '\\$1')
      .replace(/\{[a-zA-Z]+\}/g, '(:any)')
      .replace(/\:any/g, '[\\w\\-\\_\\.]+')
      .replace(/\:word/g, '[a-zA-Z]+')
      .replace(/\:num/g, '\\d+');

    return new RegExp(`^${rule}$`, 'i');
  }

  return route;
}

module.exports = {
  trimSlashes,
  transformURL,
  parseQuery,
  parseRouteRule
};
