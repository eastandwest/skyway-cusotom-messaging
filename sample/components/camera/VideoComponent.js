var React = require('react');


navigator._getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var CameraVideoComponent = React.createClass({
  getInitialState(){
    return {
      "num_monitors" : 0,
      "media_stream": null,
      "callObjs": {}
    }
  },
  componentDidMount(){
    this.props.pcm.on("request", this.setPCMHanlder);
  },
  setPCMHanlder(req, res) {
    if(req.method === "GET" && req.resource === "/livestream") {
      var monitorID = res.dst;

      if(req.parameter === "start") {
        res.write("ok");
        res.end();

        if(!this.state.media_stream) {
          try{
            this.startVideo(monitorID, () => {
              res.write("ok");
              res.end();
            });
          } catch(err) {
            res.status(404);
            res.write(err.toString());
            res.end();
          }
        } else {
          this.startCall(monitorID);
        }
      } else if(req.parameter === "stop") {
        res.write("ok");
        res.end();

        this.stopCall(monitorID);
      }
    }
  },
  startVideo(monitorID, callback) {
      navigator.webkitGetUserMedia({"video": true, "audio": false}, (stream) => {
        this.setState({
          "media_stream": stream,
          "url": URL.createObjectURL(stream)
        });
        callback();
        this.startCall(monitorID);
      }, (err) => {
        throw err;
      });
  },
  startCall(monitorID) {
    var call = this.props.peer.call(monitorID, this.state.media_stream);
    this.state.callObjs[monitorID] = call;
    this.countNumMonitors();
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
        <video width="100%" src={this.state.url} autoPlay />
      </div>
    );
  }
});


module.exports = CameraVideoComponent;


