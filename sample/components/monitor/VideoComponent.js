var React = require('react')

require('../css/default.css')

var MonitorVideoComponent = React.createClass({
  getInitialState() {
    return {
      video_status: "stopped",
      streaming_url: "",
      btnNode: null,
      btn_class: "btn btn-success"
    }
  },
  componentDidMount() {

    this.props.peer.on("call", (call) => {
      if(call.peer === this.props.cameraId) {
        call.answer();

        call.on('stream', (stream) => {
          this.setState({"btn_class": "btn btn-warning", "streaming_url": URL.createObjectURL(stream), "video_status": "playing"});
          this.state.btnNode.disabled = "";
          this.state.btnNode.dataset.type = "stop";
          this.state.btnNode.innerHTML = "<span class='glyphicon glyphicon-stop'></span> stop";
        });

        call.on('close', () => {
          this.setState({"btn_class": "btn btn-success", "streaming_url": "", "video_status": "stopped"});
          this.state.btnNode.disabled = "";
          this.state.btnNode.dataset.type = "watch";
          this.state.btnNode.innerHTML = "<span class='glyphicon glyphicon-play'></span> watch";
        });
      }
    });
  },

  onBtnClick(e) {
    this.state.btnNode = e.currentTarget;
      console.dir(e.currentTarget)
    if(this.state.btnNode.dataset.type === "watch") {
      this.props.pcm.get(this.props.cameraId, '/livestream', 'start').then((data) => {
        this.setState({"btn_class": "btn btn-success", "video_status": "connecting"});
        this.state.btnNode.textContent = "connecting...";
        this.state.btnNode.dataset.type = "connecting";
        this.state.btnNode.disabled = "disabled";
      });
    } else {
      this.props.pcm.get(this.props.cameraId, '/livestream', 'stop').then((data) => {
        this.setState({"btn_class": "btn btn-warning", "video_status": "disconnecting"});
        this.state.btnNode.textContent = "disconnecting...";
        this.state.btnNode.dataset.type = "disconnecting";
        this.state.btnNode.disabled = "disabled";
      });
    }
  },
  render() {
    return (
      <div className="monitorVideoComponent">
        <p className="text-center">
          <button className={this.state.btn_class} onClick={this.onBtnClick} data-type="watch">
            <span className="glyphicon glyphicon-play"></span> Watch
          </button>
        </p>
        <div>
          <div class="embed-responsive embed-responsive-4by3">
            <video className="video-component embed-responsive-item" data-status={this.state.video_status} src={this.state.streaming_url} width="100%" autoPlay />
          </div>
        </div>
      </div>
    )
  }
});

module.exports = MonitorVideoComponent;
