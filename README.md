Example
-------

```javascript

var Prison = require('prison');
var prison = new Prison(2000);

var warden = prison.incarcerate('YOUR_KEY_HERE', function(w) {

  someAsyncFunction('data', function(result) {
    w.done(result);
  });

});

warden.on('done', function(data) {
  // do something with cached data
});

```
