class HistoryMock {
  /**
   * @type {import('./location-mock').LocationMock}
   * @protected
   */
  location;

  /**
   * @param {import('./location-mock').LocationMock} location 
   */
  constructor(location) { 
    this.location = location;
  }

  /**
   * @param {any} state 
   * @param {any} data 
   * @param {string} path 
   */
  replaceState(state, data, path) {
    this.changeLocation(path);
  }

  /**
   * @param {any} state 
   * @param {any} data 
   * @param {string} path 
   */
  pushState(state, data, path) {
    this.changeLocation(path);
  }

  /**
   * @param {string} path 
   */
  changeLocation(path) {
    let splits = path?.split?.('?');

    if(splits) {
      this.location.pathname = splits[0];

      if(splits.length > 1) {
        this.location.search = '?' + splits[1];
      }
    }
  }
}

module.exports = {
  HistoryMock
};
