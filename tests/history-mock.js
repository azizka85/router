class HistoryMock {
  location;

  constructor(location) {
    this.location = location;
  }

  replaceState(state, data, path) {
    this.changeLocation(path);
  }

  pushState(state, data, path) {
    this.changeLocation(path);
  }

  changeLocation(path) {
    let query = path?.split?.('?');

    if(query) {
      this.location.pathname = query[0];

      if(query.length > 1) {
        this.location.search = '?' + query[1];
      }
    }
  }
}

exports.HistoryMock = HistoryMock;