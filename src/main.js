const { Router } = require('../index');

let router = new Router({
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
  }]
});

window.router = router;
    