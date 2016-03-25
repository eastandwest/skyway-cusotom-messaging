var Backbone = require('backbone')
  , PeerCustomMesg = require('../../lib/index')
  , _ = require('underscore')
  , validation = require('backbone-validation')
  , md5 = require('md5')

Backbone.LocalStorage = require('backbone.localstorage')
_.extend(Backbone.Model.prototype, validation.mixin);


var Camera = Backbone.Model.extend({
  localStorage: new Backbone.LocalStorage("PCMCamera"),
  defaults: {
    id: 1,
    name: "",
    location: "",
    passcode: "",
    camera_id: ""
  },
  validation: {
    name: {
      required: true,
      rangeLength: [4, 32]
          },
    location: {
      required: true,
      rangeLength: [4, 32]
          },
    passcode: {
      required: true,
      pattern: /^[0-9]{6}/,
      msg: "Passcode must be 6 length digit"
              }
  },
  initialize() {
    this.peer = null;
    this.pcm = null;
    this.stored = false;

    this.mypeerid = "camera"+this.makeRandom(10000000000);
    this.set({"mypeerid": this.mypeerid});

    // to read attributes from localStrage
    this.fetch({"id": 1}).then((res) => {
      this.stored = true;
      this.trigger("stored:checked", {"stored": this.stored});
    }, (err) => {
      this.trigger("stored:checked", {"stored": this.stored});
    });

    // when 1st access, allocate camera_id
    if(this.get("camera_id") === "") {
      let _camera_id = md5(Date.now().toString() + this.makeRandom(100000));
      this.set("camera_id", _camera_id);
      this.save("camera_id", _camera_id);
    }

    this.handleAttrChange();
  },
  makeRandom(seed) {
    return Math.floor(Math.random()*seed);
  },
  startPeer(obj) {
    this.peer = new Peer(this.mypeerid, obj);

    // when connection to skyway server established.
    this.peer.on("open", (id) => {
      this.peerid = id;
      this.pcm = new PeerCustomMesg(this.peer);
      this.handlePCM();

      this.trigger("ready");
    });
  },
  handleAttrChange() {
  },
  handlePCM() {
    this.pcm.on("request", (req, res) => {
      console.log(req, res);
      if(req.method === "GET") {
        switch(req.resource) {
        case "/profile":
          if(!!this.get("passcode")) {
            // already configured, respond profile
            res.write({"name": this.get("name"), "location": this.get("location"), "camera_id": this.get("camera_id")});
            res.end();
          } else {
            // not configured yet, then send 404 response
            res.status(404);
            res.write("Not configured yet.");
            res.end();
          }
          break;
        case "/livestream":
          // check passcode matches with this, plz notice that passcode in request is hashed
          if( req.parameter.passcode === md5( this.get("passcode") ) ) {
            res.write("ok");
            res.end();
            // to notice view component that request for livestream come
            this.trigger("peer:stream", {"monitorID": res.dst, "param": req.parameter.state});
          } else {
            res.status(400);
            res.write("Passcode does not match with mine.");
            res.end();
          }
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
