var Backbone = require('backbone')
  , PeerCustomMesg = require('../../lib/index')
Backbone.LocalStorage = require('backbone.localstorage')


var CameraModel = Backbone.Model.extend({
  localStorage: new Backbone.LocalStorage("PCM"),
  defaults: {
    id: 1,
    name: "ken",
    location: "hoge",
    passcode: "123456"
  },
  initialize() {
    this.peer = null;
    this.pcm = null;
    this.fetch({"id": 1}); // read attributes from localStorage
  },
  setPeer(peer) {
    this.peer = peer;
    this.pcm = new PeerCustomMesg(this.peer);
    this.setPCMHandler();
  },
  setPCMHandler() {
    this.pcm.on("request", (req, res) => {
      console.log(req, res);
      if(req.method === "GET") {
        switch(req.resource) {
        case "/profile":
          res.write({"name": this.get("name"), "location": this.get("location")});
          res.end();
          break;
        case "/livestream":
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



module.exports = CameraModel;
