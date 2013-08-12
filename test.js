var tape = require('tape');
var Prison = require('./index');

var default_time = 15 * 60 * 1000;
var key = 'some_key';

(function() {

  tape('Stores correct cache', function(test) {
    test.plan(3);

    var prison = new Prison(default_time);

    var func = function(handler) {
      test.ok(true, 'tried to access value for cache');
      handler.done("test");
    }

    var warden1 = prison.incarcerate(key, func);

    warden1.on('done', function(value) {
      test.equals(value, "test", "gets correct value");
    });

    setTimeout(function() {
      var warden2 = prison.incarcerate(key, func);

      warden2.on('done', function(value) {
        test.equals(value, "test", "gets correct value");
      });
    }, 100);
  });

  (function() {
    var func = function(handler) {
      handler.done("test");
    }

    tape('Uses default time', function(test) {
      var prison = new Prison(default_time);
      test.plan(1);
      var warden1 = prison.incarcerate(key, func);

      prison._set = function(key, result, time) {
        test.equal(time, default_time);
      };
    });

    tape('Uses modified time', function(test) {
      var prison = new Prison(default_time);

      test.plan(1);

      var func = function(handler) {
        handler.done("test");
      }

      var warden1 = prison.incarcerate(key, 9000, func);

      prison._set = function(key, result, time) {
        test.equal(time, 9000);
      };
    });

  })();
})();

(function() {
  tape('value returned is from cache', function(test) {
    test.plan(1);

    var backend = {
      get: function() {
        return { result: "1", time: (new Date()).getTime() * 1000000 }
      }
    }

    var prison = new Prison(default_time, backend);
    var warden1 = prison.incarcerate(key, function(handler) {
      handler.done("2");
    });

    warden1.on('done', function(value) {
      test.equal(value, "1");
    });
  });

  tape('value returned is from function when key is not found', function(test) {
    test.plan(1);

    var backend = {
      get: function() {
        return null;
      },
      set: function() { }
    }

    var prison = new Prison(default_time, backend);
    var warden1 = prison.incarcerate(key, function(handler) {
      handler.done("2");
    });

    warden1.on('done', function(value) {
      test.equal(value, "2");
    });
  });

  tape('value returned is from function on stale time', function(test) {
    test.plan(1);

    var backend = {
      get: function() {
        return { result: "1", time: 0 }
      },
      set: function() { }
    }

    var prison = new Prison(default_time, backend);
    var warden1 = prison.incarcerate(key, function(handler) {
      handler.done("2");
    });

    warden1.on('done', function(value) {
      test.equal(value, "2");
    });
  });
})();
