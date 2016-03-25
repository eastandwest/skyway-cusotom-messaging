var Backbone = require('backbone');

var CameraAppState = Backbone.Model.extend({
  defaults: {
    "config": "idle",
    "camera": "idle"
  },
  initialize() {
    this.on("change:config", (model, method) => {
      console.log("change:config - ", method);
      var state = this.get("config");
      this.trigger("config:"+state);
      this.set({"config": "idle"});
    });
    this.on("change:camera", (model, method) => {
      console.log("change:camera", method, model);
      var state = this.get("camera");
      this.trigger("camera:"+state);
      this.set({"camera": "idle"});
    });
  }
});

module.exports = CameraAppState;
