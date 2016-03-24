var Backbone = require('backbone')
  , _ = require('underscore')
  , validation = require('backbone-validation')

_.extend(Backbone.Model.prototype, validation.mixin);


var Monitor = Backbone.Model.extend({
  default: {
    "name" : "",
    "location": "",
    "camPeerID": "",
    "passcode": "abcd"
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
  initialize(){
  }
});

module.exports = Monitor;
