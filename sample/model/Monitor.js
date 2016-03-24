var Backbone = require('backbone')
  , _ = require('underscore')
  , validation = require('backbone-validation')

_.extend(Backbone.Model.prototype, validation.mixin);

const PREFIX = "PCM_MONITOR_PASSCODE";

var Monitor = Backbone.Model.extend({
  default: {
    "camera_id": "",
    "name" : "",
    "location": "",
    "camPeerID": "",
    "passcode": ""
  },
  validation: {
    camera_id: {
      required: true,
      length: 32
    },
    camPeerID: {
      required: true,
      rangeLength: [4, 32]
    },
    name: {
      required: true,
      rangeLength: [2, 32]
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
  initialize(){
  },
  syncPasscodeWithLDB() {
    if(this.get("camera_id") === "") {
      throw "syncPasscodeWithLDB - camera_id does not set yet.";
    }
    let _passcode = localStorage[PREFIX+this.get("camera_id")] || this.get("passcode");
    this.set("passcode", _passcode);
  },
  setPasscode(passcode){
    localStorage[PREFIX+this.get("camera_id")] = passcode;
    this.set("passcode", passcode);
  }
});

module.exports = Monitor;
