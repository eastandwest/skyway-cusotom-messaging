var React = require('react')

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

        // if WebRTC video stream comes.
        call.on('stream', (stream) => {
          this.setState({"btn_class": "btn btn-warning", "streaming_url": URL.createObjectURL(stream), "video_status": "playing"});
          this.state.btnNode.disabled = "";
          this.state.btnNode.dataset.type = "stop";
          this.state.btnNode.innerHTML = "<span class='glyphicon glyphicon-stop'></span> stop";
        });

        // when WebRTC video stream closed
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
    this.state.btnNode = e.currentTarget;
    if(this.state.btnNode.dataset.type === "watch") {
      var err = this.getModel().preValidate("passcode", this.state.passcode);

      if(!err) {
        this.props.pcm.get(this.camPeerID, '/livestream', 'start').then((data) => {
          this.setState({"error_msg": ""});
          this.setState({"btn_class": "btn btn-success", "video_status": "connecting"});
          this.state.btnNode.textContent = "connecting...";
          this.state.btnNode.dataset.type = "connecting";
          this.state.btnNode.disabled = "disabled";
        });
      } else {
        this.setState({"error_msg": err});
      }
    } else {
      this.props.pcm.get(this.camPeerID, '/livestream', 'stop').then((data) => {
        this.setState({"btn_class": "btn btn-warning", "video_status": "disconnecting"});
        this.state.btnNode.textContent = "disconnecting...";
        this.state.btnNode.dataset.type = "disconnecting";
        this.state.btnNode.disabled = "disabled";
      });
    }
  },
  handlePasscodeChange(e) {
    console.log(0);
    this.setState({"passcode": e.target.value});
  },
  // render
  //
  render() {
    return (
      <div className="monitorVideoComponent">
        <p className="text-center">
        {(() => { if(!!this.state.error_msg) return (
          <div className="alert alert-danger">{this.state.error_msg}</div>
          )})()}
          <label>Passcode</label>
          <input type="text" name="passcode" value={this.state.passcode} onChange={this.handlePasscodeChange} />
          <br />
          <button className={this.state.btn_class} onClick={this.handleWatchBtnClick} data-type="watch">
            <span className="glyphicon glyphicon-play"></span> Watch
          </button>
        </p>
        <div>
          <div className="embed-responsive embed-responsive-4by3">
            <video className="video-component embed-responsive-item" data-status={this.state.video_status} src={this.state.streaming_url} width="100%" autoPlay />
          </div>
        </div>
      </div>
    )
  }
});

module.exports = MonitorVideoComponent;
