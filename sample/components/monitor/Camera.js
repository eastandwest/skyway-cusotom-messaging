var React = require('react')

var MonitorCameraComponent = React.createClass({
  getInitialState() {
    return {
      streaming_url: "",
      btnNode: null
    }
  },
  componentDidMount() {
    this.props.peer.on("call", (call) => {
      call.answer();

      call.on('stream', (stream) => {
        this.setState({"streaming_url": URL.createObjectURL(stream)});
        this.state.btnNode.disabled = "";
        this.state.btnNode.textContent = "stop";
      });

      call.on('close', () => {
        this.setState({"streaming_url": ""});
        this.state.btnNode.disabled = "";
        this.state.btnNode.textContent = "watch";
      });
    });
  },

  onBtnClick(e) {
    this.state.btnNode = e.target;
    if(this.state.btnNode.textContent === "watch") {
      this.props.pcm.get(this.props.cameraId, '/livestream', 'start').then((data) => {
        this.state.btnNode.textContent = "connecting...";
        this.state.btnNode.disabled = "disabled";
      });
    } else {
      this.props.pcm.get(this.props.cameraId, '/livestream', 'stop').then((data) => {
        this.state.btnNode.textContent = "disconnecting...";
        this.state.btnNode.disabled = "disabled";
      });
    }
  },
  render() {
    return (
      <div className="monitorCamera">
        <p className="text-center">
          <button className="btn btn-default" onClick={this.onBtnClick}>watch</button>
        </p>
        <p>
          <video src={this.state.streaming_url} width="100%" autoPlay />
        </p>
      </div>
    )
  }
});

module.exports = MonitorCameraComponent;
