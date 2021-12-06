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
    const router = new Router({
      root: '/root/'
    });

    expect(router.fragment).toEqual('');
    expect(router.query).toEqual({});

    history.pushState(null, null, '/root/hello/Aziz');

    expect(router.fragment).toEqual('hello/Aziz');
    expect(router.query).toEqual({});

    history.replaceState(null, null, '/root/search?firstname=Aziz&lastname=Kudaikulov');

    expect(router.fragment).toEqual('search');
    expect(router.query).toEqual({
      firstname: 'Aziz',
      lastname: 'Kudaikulov'
    });
  });

  test('Handlers for route "hello/(:any)" should work correctly', () => {
    let routeCheck = false;

    const router = new Router({
      root: '/root/',
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

    router.navigateTo('/root/hello/Aziz');

    expect(routeCheck).toEqual(true);
    expect(location.pathname).toEqual('/root/hello/Aziz');
    expect(location.search).toEqual('');

    routeCheck = false;

    router.redirectTo('/root/hello/Aziz');

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
      root: '/root/',
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

    router.navigateTo('/root/search?firstname=Aziz&lastname=Kudaikulov');

    expect(routeCheck).toEqual(true);
    expect(location.pathname).toEqual('/root/search');
    expect(location.search).toEqual('?firstname=Aziz&lastname=Kudaikulov');

    routeCheck = false;

    router.navigateTo('?firstname=Aziz&lastname=Kudaikulov&test=1');

    expect(routeCheck).toEqual(true);
    expect(location.pathname).toEqual('/root/search');
    expect(location.search).toEqual('?firstname=Aziz&lastname=Kudaikulov&test=1');

    routeCheck = false;

    router.redirectTo('/root/search?firstname=Aziz&lastname=Kudaikulov');

    expect(routeCheck).toEqual(true);
    expect(location.pathname).toEqual('/root/search');
    expect(location.search).toEqual('?firstname=Aziz&lastname=Kudaikulov');

    routeCheck = false;

    router.redirectTo('?firstname=Aziz&lastname=Kudaikulov&test=1');

    expect(routeCheck).toEqual(true);
    expect(location.pathname).toEqual('/root/search');
    expect(location.search).toEqual('?firstname=Aziz&lastname=Kudaikulov&test=1');

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

  test('Should break correctly', () => {
    let routeCheck = false;
    let breakCheck = false;

    const router = new Router({
      root: '/root/',
      before(page) {
        if(page.fragment === 'break') {
          breakCheck = page.query.firstname === 'Aziz'
            && page.query.lastname === 'Kudaikulov';
          
          return true;
        }        

        return false;
      },
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
    expect(breakCheck).toEqual(false);

    router.navigateTo('/root/search?firstname=Aziz&lastname=Kudaikulov');

    expect(routeCheck).toEqual(true);
    expect(breakCheck).toEqual(false);
    expect(location.pathname).toEqual('/root/search');
    expect(location.search).toEqual('?firstname=Aziz&lastname=Kudaikulov');

    routeCheck = false;
    breakCheck = false;

    router.navigateTo('/root/break?firstname=Aziz&lastname=Kudaikulov');

    expect(routeCheck).toEqual(false);
    expect(breakCheck).toEqual(true);
    expect(location.pathname).toEqual('/root/break');
    expect(location.search).toEqual('?firstname=Aziz&lastname=Kudaikulov');
  });
})
