var Backbone = require('backbone')
  , PeerCustomMesg = require('../../lib/index')

Backbone.LocalStorage = require('backbone.localstorage')


var Camera = Backbone.Model.extend({
  localStorage: new Backbone.LocalStorage("PCM"),
  defaults: {
    id: 1,
    name: "",
    location: "",
    passcode: ""
  },
  initialize() {
    this.peer = null;
    this.pcm = null;

    this.mypeerid = "camera"+this.makeRandom(10000000000);
    console.log(this.mypeerid);
    this.set({"mypeerid": this.mypeerid});

    // to read attributes from localStrage
    this.fetch({"id": 1});
  },
  makeRandom(seed) {
    return Math.floor(Math.random()*seed);
  },
  startPeer(obj) {
    console.log(this.mypeerid);
    this.peer = new Peer(this.mypeerid, obj);

    // when connection to skyway server established.
    this.peer.on("open", (id) => {
      this.peerid = id;
      this.pcm = new PeerCustomMesg(this.peer);
      this.handlePCM();

      this.trigger("ready");
    });
  },
  handlePCM() {
    this.pcm.on("request", (req, res) => {
      console.log(req, res);
      if(req.method === "GET") {
        switch(req.resource) {
        case "/profile":
          res.write({"name": this.get("name"), "location": this.get("location")});
          res.end();
          break;
        case "/livestream":
          // to notice view component that request for livestream come
          this.trigger("peer:stream", {"monitorID": res.dst, "param": req.parameter});

          res.write("ok");
          res.end();
          break;
        default:
          res.status(404);
          res.write("NOT Found");
          res.end();
        }
      } else {
        res.status(404);
        res.write("NOT Found");
        res.end();
      }
    });
  }
});



module.exports = Camera;
