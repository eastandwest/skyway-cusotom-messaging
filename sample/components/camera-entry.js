if(process.env.NODE_ENV==="sample") {
  require("../camera.html"); // this includes html file in watcher list.
}

var React = require('react')
  , ReactDOM = require('react-dom')
  , CameraView = require('./camera/ViewComponent')
  , ConfigView = require('./config/ViewComponent')
  , CameraModel = require('../model/Camera')

var makeRandom = (seed) => {
  return Math.floor(Math.random(seed)*seed);
};
var myid = "camera" + makeRandom(10000000000);

var peer = new Peer(myid, {"key": "dbe1b9ed-5a52-4488-a592-c451daf74206"});

peer.on('open', (id) => {
  console.log(id);

  var cameraModel = new CameraModel();
  cameraModel.setPeer(peer);

  var cameraView = CameraView({"camera": cameraModel, "peer": peer})
    , configView = ConfigView({"camera": cameraModel});


  ReactDOM.render(configView, document.getElementById("config-view"));
  ReactDOM.render(cameraView, document.getElementById("camera-view"));
});



