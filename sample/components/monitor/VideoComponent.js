var React = require('react')
  , md5 = require('md5')

require('react.backbone')
require('../css/default.css')


var MonitorVideoComponent = React.createBackboneClass({
  getInitialState() {
    return {
      video_status: "stopped",
      streaming_url: "",
      btnNode: null,
      btn_class: "btn btn-success",
      passcode: "",
      error_msg: ""
    }
  },
  componentDidMount() {
    this.camPeerID = this.getModel().get('camPeerID');
    this.setState({"passcode": this.getModel().get('passcode')});

    this.handleCall();
  },
  // handler for WebRTC video call event
  //
  handleCall(){
    this.props.peer.on("call", (call) => {
      // this handler hooks events for other monitors. To filter those, check call.peer (it represents camera's peerid)
      if(call.peer === this.camPeerID) {
        // answer to camera's offer
        call.answer();

        // if WebRTC video stream arrives.
        call.on('stream', (stream) => {
          this.setState({"btn_class": "btn btn-warning", "streaming_url": URL.createObjectURL(stream), "video_status": "playing"});
          this.state.btnNode.disabled = "";
          this.state.btnNode.dataset.type = "stop";
          this.state.btnNode.innerHTML = "<span class='glyphicon glyphicon-stop'></span> stop";
        });

        // when WebRTC video stream is closed
        call.on('close', () => {
          this.setState({"btn_class": "btn btn-success", "streaming_url": "", "video_status": "stopped"});
          this.state.btnNode.disabled = "";
          this.state.btnNode.dataset.type = "watch";
          this.state.btnNode.innerHTML = "<span class='glyphicon glyphicon-play'></span> watch";
        });
      }
    });
  },
  // handler for watch button
  //
  handleWatchBtnClick(e) {
    // check format of pass code is valid
    let err = this.getModel().preValidate("passcode", this.state.passcode);

    if(!err) {
      // when passcode is valid, store pass code to model
      this.setState({"error_msg": ""});
      this.getModel().set("passcode", this.state.passcode);
    } else {
      // when passcode is invalid show up error message. then return;
      this.setState({"error_msg": err});
      return;
    }

    // store this button node to React's status. since it is used for call.on("stream close")
    this.state.btnNode = e.currentTarget
    let _hashed_passcode = md5(this.getModel().get("passcode"));

    // send PCM request with /livestream. param.state will be changed based on btnNode state(type=watch or not)
    if(this.state.video_status === "stopped") {
      this.props.pcm.get(this.camPeerID, '/livestream', {"state": "start", "passcode": _hashed_passcode}).then((data) => {
        this.setState({"btn_class": "btn btn-success", "video_status": "connecting"});
        this.state.btnNode.textContent = "connecting...";
        this.state.btnNode.dataset.type = "connecting";
        this.state.btnNode.disabled = "disabled";
      }).catch((err) => {
        console.log(err);
        this.setState({"error_msg": err});
      });
    } else if(this.state.video_status === "playing") {
      this.props.pcm.get(this.camPeerID, '/livestream', {"state": "stop", "passcode": _hashed_passcode}).then((data) => {
        this.setState({"btn_class": "btn btn-warning", "video_status": "disconnecting"});
        this.state.btnNode.textContent = "disconnecting...";
        this.state.btnNode.dataset.type = "disconnecting";
        this.state.btnNode.disabled = "disabled";
      }).catch((err) => {
        this.setState({"error_msg": err});
      })
    } else {
      throw "video status should be playing or stopped when calling handleWatchBtnClick";
    }
  },
  handlePasscodeChange(e) {
    this.setState({"passcode": e.target.value});
  },
  // render
  //
  render() {
    return (
      <div className="monitorVideoComponent">
        {(() => { if(!!this.state.error_msg) return (
          <div className="alert alert-danger">{this.state.error_msg}</div>
        )})()}
        <p className="text-center">
         <label>Passcode</label>
          <input type="text" name="passcode" value={this.state.passcode} onChange={this.handlePasscodeChange} />
          <br />
          <button className={this.state.btn_class} onClick={this.handleWatchBtnClick}>
            <span className="glyphicon glyphicon-play"></span> Watch
          </button>
        </p>
        <div>
          <div className="embed-responsive embed-responsive-4by3">
            <video className="video-component embed-responsive-item" src={this.state.streaming_url} width="100%" autoPlay />
          </div>
        </div>
      </div>
    )
  }
});

module.exports = MonitorVideoComponent;
