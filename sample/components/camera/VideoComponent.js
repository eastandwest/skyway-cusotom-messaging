var React = require('react');

require('../css/default.css');
require('react.backbone')
require('webrtc-adapter');

var CameraVideoComponent = React.createBackboneClass({
  getInitialState(){
    return {
      "num_monitors" : 0,
      "media_stream": null,
      "url": "",
      "callObjs": {}
    }
  },
  componentDidMount(){
    this.startVideo();
    this.camera = this.getModel();

    this.camera.on("peer:stream", (obj) => {
      if(obj.param === "start") {
        this.startCall(obj.monitorID);
      } else {
        this.stopCall(obj.monitorID);
      }
    });
  },
  startVideo() {
      navigator.getUserMedia({"video": true, "audio": false}, (stream) => {
        this.setState({
          "media_stream": stream,
          "url": URL.createObjectURL(stream)
        });
      }, (err) => {
        throw err;
      });
  },
  startCall(monitorID) {
    var call = this.camera.peer.call(monitorID, this.state.media_stream);
    this.state.callObjs[monitorID] = call;
    this.countNumMonitors();

    // when the close for peer's media channel is detected
    // assuming that peer is closed because of browser close etc.
    // however, it does not work with firefox ...
    call.on('close', () => {
      this.stopCall(monitorID);
    });
  },
  stopCall(monitorID) {
    if(this.state.callObjs[monitorID]) {
      this.state.callObjs[monitorID].close();
      delete this.state.callObjs[monitorID];
      this.countNumMonitors();
    }
  },
  countNumMonitors(){
    var count = 0;
    for(var monitorid in this.state.callObjs) if(this.state.callObjs.hasOwnProperty(monitorid)) {
      count++;
    }
    this.setState({"num_monitors": count});
  },

  render() {
    return (
      <div className="cameraVideoComponent">
        <div># of connecting monitors : {this.state.num_monitors}</div>
        <div className="embed-responsive embed-responsive-4by3">
          <video className="video-component embed-responsive-item" width="100%" src={this.state.url} autoPlay />
        </div>
      </div>
    );
  }
});


module.exports = CameraVideoComponent;
