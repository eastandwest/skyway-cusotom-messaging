if(process.env.NODE_ENV==="sample") {
  require("../camera.html"); // this includes html file in watcher list.
}

var React = require('react')
  , ReactDOM = require('react-dom')
  , CameraView = require('./camera/ViewComponent')
  , ConfigView = require('./config/ViewComponent')
  , Camera = require('../model/Camera')

var camera = new Camera();
camera.startPeer({"key": "dbe1b9ed-5a52-4488-a592-c451daf74206"});
camera.on('ready', () => {
  var cameraView = CameraView({"model": camera})
  var configView = ConfigView({"model": camera});


  ReactDOM.render(configView, document.getElementById("config-view"));
  ReactDOM.render(cameraView, document.getElementById("camera-view"));
});



