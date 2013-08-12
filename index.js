function MemoryBackend() {
  this.store = {};
}

MemoryBackend.prototype.get = function(key) {
  return this.store[key];
}

MemoryBackend.prototype.set = function(key, value) {
  this.store[key] = value;
}

function Warden() {}
(require('util')).inherits(Warden, require('events').EventEmitter);

Warden.prototype.done = function(val) {
  this.emit('done', val);
}

function Prison(default_time, backend) {
  this.default_time = default_time;
  this.backend = backend || new MemoryBackend();
}

Prison.prototype.incarcerate = function(key, time, func) {
  if (typeof(time) == 'function') {
    func = time;
    time = this.default_time;
  }

  var cached = this._get(key);
  var warden = new Warden(key);

  if (!cached || cached.time < (new Date()).getTime()) {
    warden.once('done', function(val) {
      this._set(key, val, time);
    }.bind(this));
    func(warden);
  } else {
    process.nextTick(function() {
      warden.done(cached.result);
    });
  }

  return warden;
}


Prison.prototype._set = function(key, result, time) {
  var timestamp = (new Date().getTime()) + time;
  this.backend.set(key, { result: result, time: timestamp });
}

Prison.prototype._get = function(key) {
  return this.backend.get(key);
}

module.exports = Prison;
