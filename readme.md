# skyway custom messaging library

Enables rpc communication between each peer via SkyWay.

## how to use

```request.js
var peer = new Peer('sender', {key: 'yourApiKey'});

peer.on('open', (id) => {
  var pcm = new PeerCustomMesg(peer);

  pcm.get('receiver', '/comment', {"name": "skyway"}).then( (data) => {
    console.log(data.response);   // cool platform XD
  });
});
```

```response.js
var peer = new Peer('receiver', {key: 'yourApiKey'});

peer.on('open', (id) => {
  var pcm = new PeerCustomMesg(peer);

  pcm.on('request', (req, res) => {
    res.write("cool platform XD");
    res.end();
  });
});
```


## API

* new PeerCustomMesg(peer[, custom_type]);
  - peer : (Peer) instance of Peer object
  - custom_type : (string) type of custom message type (default: CUSTOMMESG)

### rpc model

* get(dst, resource[, parameter]).then(resolve, reject)
  - dst : (string) destination peer id
  - resource : (string) resource name begin with '/' (e.g. /resource )
  - parameter : (any) request parameter

* rpc(method, dst, resource[, parameter]).then(resolve, reject)
  - method : (string) method name (GET|POST|DELETE|PUT)
  - dst : (string) destination peer id
  - resource : (string) resource name begin with '/' (e.g. /resource )
  - parameter : (any) request parameter

* resolve(val) => {}
  - status : "200",
  - method : same as request method (e.g. GET)
  - resource : same as request resource (e.g. /resource)
  - response : response data

### message passing model

* send(dst, data)
* Event: 'message'
  - data

## how to build

```
$ webpack
```

* minified ( todo: different configuration should be created )

```
$ webpack -p
```

# how to develop

```
$ npm run dev
$ open https://localhost:8080/camera.html
$ open https://localhost:8080/monitor.html
```

# how to run unit test

* command-line only

```
$ npm run test
```

* browser test

```
$ npm run devtest
$ open http://localhost:8081/test.html
```

# sample site

* camera.html

https://eastandwest.github.io/skyway-cusotom-messaging/sample/camera.html

* monitor.html

https://eastandwest.github.io/skyway-cusotom-messaging/sample/monitor.html

---
&copy; kensaku komatsu
