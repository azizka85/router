const { trimSlashes, parseQuery, transformURL, parseRouteRule } = require('../src/utils');

describe('utils test', () => {
  test('trimSlashes function', () => {
    const val = trimSlashes('/test/');

    expect(val).toEqual('test');
  });

  test('parseQuery function', () => {
    const query = parseQuery('?test1=123&test2&test3=abc&test4=abc123&test5=123abc');

    const test1Val = query.test1;

    expect(test1Val).toEqual('123');

    const test2Val = query.test2;

    expect(test2Val).toEqual('1');

    const test3Val = query.test3;

    expect(test3Val).toEqual('abc');

    const test4Val = query.test4;

    expect(test4Val).toEqual('abc123');

    const test5Val = query.test5;

    expect(test5Val).toEqual('123abc');

    const queryLength = Object.keys(query).length;

    expect(queryLength).toEqual(5);
  });

  test('transformURL function', () => {
    const url1 = transformURL('/test?test=1', '', '/');

    expect(url1).toEqual('test?test=1');

    const url2 = transformURL('/test?', '', '/');

    expect(url2).toEqual('test');

    const url3 = transformURL('?test=1', 'test', '/');

    expect(url3).toEqual('test?test=1');

    const url4 = transformURL('/abc/test?test=1', '', '/abc/');

    expect(url4).toEqual('test?test=1');

    const url5 = transformURL('/abc/test?', '', '/abc/');

    expect(url5).toEqual('test');
  });

  test('parseRouteRule function', () => {
    const numRoute = parseRouteRule('test/(:num)');

    expect(numRoute).toEqual(/^test\/(\d+)$/i);

    const wordRoute = parseRouteRule('test/(:word)');

    expect(wordRoute).toEqual(/^test\/([a-zA-Z]+)$/i);

    const anyRoute = parseRouteRule('test/(:any)');

    expect(anyRoute).toEqual(anyRoute);
  });
});
