const { JSDOM } = require('jsdom');

const { LocationMock } = require('../src/mocks/location-mock');
const { HistoryMock } = require('../src/mocks/history-mock');

const { Router } = require('../src/router');
const { RouteNavigator } = require('../src/route-navigator');

describe('RouteNavigator test', () => {
  beforeEach(() => {
    const dom = new JSDOM();

    global.window = dom.window;
    global.location = new LocationMock();
    global.history = new HistoryMock(location);

    global.Event = window.document.defaultView.Event;

    location.pathname = '/kz/test';
    location.search = '?test=123';
  });

  test('navigate to (kz|ru|en)/test', async () => {
    let success = false;
    let fragment;
    let match;
  
    const router = new Router({
      before: async (page) => {
        success = false;
        match = undefined;
        fragment = page.fragment;
  
        return false;
      },
      routes: [{
        rule: '(kz|ru|en)/test',
        handler: async (page) => {
          match = page.match;
  
          success = 
            (fragment?.endsWith('/test') || false) &&
            (match?.length || 0) > 0; 
        }
      }]
    });
  
    const navigator = new RouteNavigator(router);  
  
    await navigator.refresh();

    expect(success).toBeTruthy();

    await navigator.navigateTo('ru/test');

    expect(success).toBeTruthy();

    await navigator.redirectTo('en/test');

    expect(success).toBeTruthy();
  });

  test('popstate event handler', () => {
    const navigator = new RouteNavigator(new Router());

    let success = false;

    navigator['popStateHandler'] = () => success = true;

    navigator.addUriListener();

    window.dispatchEvent(new Event('popstate'));

    expect(success).toBeTruthy();

    success = false;

    navigator.removeUriListener();

    window.dispatchEvent(new Event('popstate'));

    expect(success).toBeFalsy();
  });
});
