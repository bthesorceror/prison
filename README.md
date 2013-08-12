# Prison

Simple interface for caching asynchronous callback responses.

## Basic Usage

###Creating a new Prison

```javascript
var Prison = require('prison');
var prison = new Prison(90000);
```

Where 90000 is the time in milliseconds (which is 15 minutes) for the cache to live.

###Cache on a key

```javascript
var warden = prison.incarcerate('YOUR_KEY_HERE', function(handler) {

  callToDatabase('data', 1, function(value) {
    handler.done(value);
  });

});
```

If the cache is stale the result of `callToDatabase` will be set as the new
value.

###Setting the TTL on a per key basis

```javascript
var warden = prison.incarcerate('YOUR_KEY_HERE', 1800000 function(handler) {

  callToDatabase('data', 1, function(value) {
    handler.done(value);
  });

});
```

The time to live for this cached value will be 30 minutes.

###Busting the cache

```javascript
prison.parole('some_key');
```

This sendsnull to the backend for 'some_key'.

##Cache Backends

By default Prison uses an in memory store, but is highly extensible.

###Passing a custom backend

```javascript
var prison = new Prison(900000, custom_backend);
```

Custom backend is any object that implements

```javascript
function get(key) {
  // returns value by key
}
```

and

```javascript
function set(key, value) {
  // sets value for key
}
```
