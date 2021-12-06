const { Router } = require('../index');

let router = new Router({
  before(page) {
    if(page.fragment === 'break' && page.query.perform) {
      console.log('Route matching broke');

      return true;
    }

    return false;
  },
  routes: [{
    rule: '',
    handler(page) {
      console.log(page);
    }
  },{
    rule: 'hello/(:any)',
    handler(page) {
      console.log(page);
    }
  }, {
    rule: 'category/(:num)/post/(:num)',
    handler(page) {
      console.log(page);
    }
  }, {
    rule: 'search',
    handler(page) {
      console.log(page);
    }
  }, {
    rule: 'break',
    handler(page) {
      console.log(page);
    }
  }]
});

window.router = router;
    