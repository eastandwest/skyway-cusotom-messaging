if(process.env.NODE_ENV==="sample") {
  require("./camera.html"); // this includes html file in watcher list.
}

var React = require('react')
  , ReactDOM = require('react-dom')
  , Backbone = require('backbone')
  , CameraView = require('./components/camera/ViewComponent')
  , ConfigView = require('./components/config/ViewComponent')
  , Camera = require('./model/Camera')
  , CameraAppState = require('./model/CameraAppState')

var configElm = document.getElementById("config-view")
  , cameraElm = document.getElementById("camera-view")

var camera = new Camera()
  , appState = new CameraAppState()
  , cameraView = CameraView({"model": camera})
  , configView = ConfigView({"model": camera, "appState": appState})

camera.startPeer({"key": "dbe1b9ed-5a52-4488-a592-c451daf74206"});
camera.on('ready', () => {
  ReactDOM.render(configView, configElm);
});

appState.on("config:submitted", () => {
  console.log("changed");
  configElm.style.display = 'none';
  ReactDOM.render(cameraView, cameraElm);
});


