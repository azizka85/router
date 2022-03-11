const { Router } = require('../src/router');

describe('Router test', () => {
  test('num route', () => {
    let success = false;
    let fragment;
    let match;

    const router = new Router({
      before: (page) => {
        success = false;
        match = undefined;
        fragment = page.fragment;
  
        return false;
      },
      routes: [{
        rule: 'test/(:num)',
        handler: (page) => {
          match = page.match;
  
          success = 
            (fragment?.startsWith('test/') || false) &&
            (match?.[0].match(/\d+/)?.length || 0) > 0; 
        }
      }]
    });
  
    router.processUrl('test/123', {});

    expect(success).toBeTruthy();

    router.processUrl('test/123a', {});

    expect(success).toBeFalsy();
  });

  test('word route', () => {
    let success = false;
    let fragment;
    let match;

    const router = new Router({
      before: (page) => {
        success = false;
        match = undefined;
        fragment = page.fragment;

        return false;
      },
      routes: [{
        rule: 'test/(:word)',
        handler: (page) => {
          match = page.match;

          success = 
            (fragment?.startsWith('test/') || false) &&
            (match?.[0].match(/[a-zA-Z]+/)?.length || 0) > 0; 
        }
      }]
    });

    router.processUrl('test/abc', {});

    expect(success).toBeTruthy();

    router.processUrl('test/a123', {});

    expect(success).toBeFalsy();
  });

  test('any route', () => {
    let success = false;
    let fragment;
    let match;

    const router = new Router({
      before: (page) => {
        success = false;
        match = undefined;
        fragment = page.fragment;

        return false;
      },
      routes: [{
        rule: 'test/(:any)',
        handler: (page) => {
          match = page.match;

          success = 
            (fragment?.startsWith('test/') || false) &&
            (match?.length || 0) > 0; 
        }
      }]
    });

    router.processUrl('test/abc-123', {});

    expect(success).toBeTruthy();

    router.processUrl('test/abc_123', {});

    expect(success).toBeTruthy();

    router.processUrl('test/abc.123', {});

    expect(success).toBeTruthy();

    router.processUrl('test/$a123', {});

    expect(success).toBeFalsy();
  });

  test('locale route', () => {
    let success = false;
    let fragment;
    let match;

    const router = new Router({
      before: (page) => {
        success = false;
        match = undefined;
        fragment = page.fragment;

        return false;
      },
      routes: [{
        rule: '(kz|ru|en)/test',
        handler: (page) => {
          match = page.match;

          success = 
            (fragment?.endsWith('/test') || false) &&
            (match?.length || 0) > 0; 
        }
      }]
    });

    router.processUrl('kz/test', {});

    expect(success).toBeTruthy();

    router.processUrl('ru/test', {});

    expect(success).toBeTruthy();

    router.processUrl('en/test', {});

    expect(success).toBeTruthy();

    router.processUrl('bug/test', {});

    expect(success).toBeFalsy();
  });
});
