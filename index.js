const { Router } = require('./src/router');

const { RouteNavigator } = require('./src/route-navigator');

const { trimSlashes, transformURL, parseQuery, parseRouteRule } = require('./src/utils');

const { LocationMock } = require('./src/mocks/location-mock');
const { HistoryMock } = require('./src/mocks/history-mock');

module.exports = {
  Router,

  RouteNavigator,

  trimSlashes,
  transformURL,
  parseQuery,
  parseRouteRule,

  LocationMock,
  HistoryMock
};
