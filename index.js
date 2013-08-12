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
  process.nextTick(function() {
    this.emit('done', val);
  }.bind(this));
}

function Prison(default_time, backend) {
  this.default_time = default_time;
  this.backend = backend || new MemoryBackend();
}

Prison.prototype.parole = function(key) {
  this.backend.set(key, null);
};

Prison.prototype.incarcerate = function(key, time, func) {
  if (typeof(time) == 'function') {
    func = time;
    time = this.default_time;
  }

  var cached = this._get(key);
  var warden = new Warden();

  if (this._useCache(cached)) {
    warden.once('done', function(val) {
      this._set(key, val, time);
    }.bind(this));
    func(warden);
  } else {
    warden.done(cached.result);
  }

  return warden;
}

Prison.prototype._useCache = function(cache) {
return (!cache || cache.time < (new Date()).getTime());
}


Prison.prototype._set = function(key, result, time) {
  var timestamp = (new Date().getTime()) + time;
  this.backend.set(key, { result: result, time: timestamp });
}

Prison.prototype._get = function(key) {
  return this.backend.get(key);
}

module.exports = Prison;
