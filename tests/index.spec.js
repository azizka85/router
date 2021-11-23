const { Router } = require('../index');

const { LocationMock } = require('./location-mock');
const { HistoryMock } = require('./history-mock');
const { WindowMock } = require('./window-mock');

describe('Router test', () => {
  beforeEach(() => {
    let location = new LocationMock();
    let history = new HistoryMock(location);
    let window = new WindowMock();

    global.location = location;
    global.history = history;
    global.window = window;
  });

  test('Should create new Router', () => {
    const router = new Router();

    expect(router.fragment).toEqual('');
    expect(router.query).toEqual({});

    history.pushState(null, null, '/hello/Aziz');

    expect(router.fragment).toEqual('hello/Aziz');
    expect(router.query).toEqual({});

    history.replaceState(null, null, '/search?firstname=Aziz&lastname=Kudaikulov');

    expect(router.fragment).toEqual('search');
    expect(router.query).toEqual({
      firstname: 'Aziz',
      lastname: 'Kudaikulov'
    });
  });

  test('Handlers for route "hello/(:any)" should work correctly', () => {
    let routeCheck = false;

    const router = new Router({
      routes: [{
        rule: 'hello/(:any)',
        handler(page) {
          routeCheck = page.fragment === 'hello/Aziz'
            && page.match[0] === 'Aziz'
            && page.options.age === 36;
        },
        options: {
          age: 36
        }
      }]
    });

    expect(routeCheck).toEqual(false);

    router.navigateTo('/hello/Aziz');

    expect(routeCheck).toEqual(true);
    expect(location.pathname).toEqual('/hello/Aziz');
    expect(location.search).toEqual('');

    routeCheck = false;

    router.redirectTo('/hello/Aziz');

    expect(routeCheck).toEqual(true);

    routeCheck = false;

    router.refresh();

    expect(routeCheck).toEqual(true);

    router.addUriListener();

    routeCheck = false;

    window.onpopstate?.();

    expect(routeCheck).toEqual(true);

    router.removeUriListener();

    routeCheck = false;

    window.onpopstate?.();

    expect(routeCheck).toEqual(false);
  });

  test('Handlers for route "search?firstname=Aziz&lastname=Kudaikulov" should work correctly', () => {
    let routeCheck = false;

    const router = new Router({
      routes: [{
        rule: 'search',
        handler(page) {
          routeCheck = page.fragment === 'search'
            && page.query.firstname === 'Aziz'
            && page.query.lastname === 'Kudaikulov'
            && page.options.age === 36;
        },
        options: {
          age: 36
        }
      }]
    });

    expect(routeCheck).toEqual(false);

    router.navigateTo('/search?firstname=Aziz&lastname=Kudaikulov');

    expect(routeCheck).toEqual(true);
    expect(location.pathname).toEqual('/search');
    expect(location.search).toEqual('?firstname=Aziz&lastname=Kudaikulov');

    routeCheck = false;

    router.redirectTo('/search?firstname=Aziz&lastname=Kudaikulov');

    expect(routeCheck).toEqual(true);

    routeCheck = false;

    router.refresh();

    expect(routeCheck).toEqual(true);

    router.addUriListener();

    routeCheck = false;

    window.onpopstate?.();

    expect(routeCheck).toEqual(true);

    router.removeUriListener();

    routeCheck = false;

    window.onpopstate?.();

    expect(routeCheck).toEqual(false);
  });
})