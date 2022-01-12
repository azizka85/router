const { Router } = require('../src/router');

describe('Router test', () => {
  test('num route', async () => {
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
        rule: 'test/(:num)',
        handler: async (page) => {
          match = page.match;
  
          success = 
            (fragment?.startsWith('test/') || false) &&
            (match?.[0].match(/\d+/)?.length || 0) > 0; 
        }
      }]
    });
  
    await router.processUrl('test/123', {});

    expect(success).toBeTruthy();

    await router.processUrl('test/123a', {});

    expect(success).toBeFalsy();
  });

  test('word route', async () => {
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
        rule: 'test/(:word)',
        handler: async (page) => {
          match = page.match;

          success = 
            (fragment?.startsWith('test/') || false) &&
            (match?.[0].match(/[a-zA-Z]+/)?.length || 0) > 0; 
        }
      }]
    });

    await router.processUrl('test/abc', {});

    expect(success).toBeTruthy();

    await router.processUrl('test/a123', {});

    expect(success).toBeFalsy();
  });

  test('any route', async () => {
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
        rule: 'test/(:any)',
        handler: async (page) => {
          match = page.match;

          success = 
            (fragment?.startsWith('test/') || false) &&
            (match?.length || 0) > 0; 
        }
      }]
    });

    await router.processUrl('test/abc-123', {});

    expect(success).toBeTruthy();

    await router.processUrl('test/abc_123', {});

    expect(success).toBeTruthy();

    await router.processUrl('test/abc.123', {});

    expect(success).toBeTruthy();

    await router.processUrl('test/$a123', {});

    expect(success).toBeFalsy();
  });

  test('locale route', async () => {
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

    await router.processUrl('kz/test', {});

    expect(success).toBeTruthy();

    await router.processUrl('ru/test', {});

    expect(success).toBeTruthy();

    await router.processUrl('en/test', {});

    expect(success).toBeTruthy();

    await router.processUrl('bug/test', {});

    expect(success).toBeFalsy();
  });
});
