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
      let profile = data.response
        , _data = {
          "camera_id": profile.camera_id,
          "camPeerID": camPeerID,
          "name": profile.name,
          "location": profile.location,
          "passcode": "000000"
        }
        , _monitor = new Monitor()

      // do validation process
      let _err = _monitor.preValidate(_data);
      if(!_err) {
        // _data is valid
        _monitor.set(_data);
        _monitor.syncPasscodeWithLDB();
        this.add(_monitor);
      } else {
        console.warn("validation for Monitor failed", _err);
      }


    }).catch((err) => {
      console.log( "getCameraProfile - [", camPeerID, "]", err);
    });
  }
});

module.exports = Monitors;
