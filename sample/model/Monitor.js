var Backbone = require('backbone')


var Monitor = Backbone.Model.extend({
  default: {
    "name" : "",
    "location": "",
    "camPeerID": ""
  },
  initialize(){
  }
});

module.exports = Monitor;
