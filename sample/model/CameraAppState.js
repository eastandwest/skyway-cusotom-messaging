var Backbone = require('backbone');

var CameraAppState = Backbone.Model.extend({
  defaults: {
    "config": "idle",
    "camera": "idle"
  },
  initialize() {
    this.on("change:config", (method, model) => {
      var state = this.get("config");
      this.trigger("config:"+state);
      this.set({"config": "idle"});
    });
  }
});

module.exports = CameraAppState;
