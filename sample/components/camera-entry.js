require("../monitor.html"); // this includes html file in watcher list.

var ReactDOM = require('react-dom')

var peer = new Peer({'key': 'dbe1b9ed-5a52-4488-a592-c451daf74206'});
var pcm = null;

// when established connection to SkyWay signaling server
peer.on("open", (id) => {
  myid = id;

});


