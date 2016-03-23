var Backbone = require('backbone')
  , Monitor = require('./Monitor')
  , PeerCustomMesg = require('../../lib/index')

var Monitors = Backbone.Collection.extend({
  model: Monitor,
  initialize(){
    this.peerid = null;
    this.peer = null;
    this.pcm = null;
  },
  startPeer(obj) {
    this.peer = new Peer(obj);

    this.peer.on("open", (id) => {
      // when connection to skyway server established.
      this.peerid = id;
      this.pcm = new PeerCustomMesg(this.peer);
      this.getCamIDs();
    });
  },
  getCamIDs() {
    this.peer.listAllPeers((peerids) => {
      peerids.forEach((peerid) => {
        console.log(peerid);
        if(peerid.indexOf("camera") === 0) {
          // its's camera.
          this.getCameraProfile(peerid);
        };
      })
    })
  },
  // retrieve profile data from camera then add model
  getCameraProfile(camPeerID){
    this.pcm.get(camPeerID, '/profile').then((data) => {
      var profile = data.response;
      this.add({"camPeerID": camPeerID, "name": profile.name, "location": profile.location});
    }).catch((err) => {
      throw err;
    });
  }
});

module.exports = Monitors;
