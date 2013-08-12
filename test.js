var tape = require('tape');
var Prison = require('./index');

(function() {
  tape('Stores correct cache', function(t) {
    t.plan(3);

    var prison = new Prison(15 * 60 * 1000);
    var key = 'some_key';

    var func = function(handler) {
      t.ok(true, 'tried to access value for cache');
      handler.done("test");
    }

    warden1 = prison.incarcerate(key, func);

    warden1.on('done', function(value) {
      t.equals(value, "test", "gets correct value");
    });

    setTimeout(function() {
      warden2 = prison.incarcerate(key, func);

      warden2.on('done', function(value) {
        t.equals(value, "test", "gets correct value");
      });
    }, 100);
  });
})();
