require("../monitor.html"); // this includes html file in watcher list.

var ReactDOM = require('react-dom')


var peer = new Peer({'key': 'dbe1b9ed-5a52-4488-a592-c451daf74206'});
var myid = null, pcm = null;

// when established connection to SkyWay signaling server
peer.on("open", (id) => {
  myid = id;

  // show camera list
  showCamList();
});

// show camera list which are serving remote video streams.
// to obtain list of remote camera service, SkyWay's REST api is used.
var showCamList = () => {
  peer.listAllPeers((list) => {
    list.forEach((camPeerID) => {
      console.log(camPeerID);
      if(camPeerID.indexOf("camera") === 0) {
        // reqCamProfile(camPeerID);
      };
    })
  })
}


