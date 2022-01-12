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
