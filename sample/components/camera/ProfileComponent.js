var React = require('react');

require('react.backbone'); // Backbone plugin for React

var CameraProfileComponent = React.createBackboneClass({
  mixins: [
    React.BackboneMixin("appState")
  ],
  getInitialState(){
    return({
      btnDisabled:""
    });
  },
  componentDidMount(){
    this.props.appState.on("camera:finishedConfigProfile", () => {
      this.enableBtn();
    });
  },
  enableBtn() {
    this.setState({"btnDisabled": ""});
  },
  handleBtnClick(e){
    this.props.appState.set("camera", "reqConfigProfile");
    this.setState({"btnDisabled": "disabled"});
  },
  render() {
    return (
      <div className="cameraProfileComponent">
        <table className="table">
        <tbody>
          <tr><td><strong>name</strong></td><td>{this.getModel().get("name")}</td></tr>
          <tr><td><strong>location</strong></td><td>{this.getModel().get("location")}</td></tr>
          <tr><td><strong>camera_id</strong></td><td>{this.getModel().get("camera_id")}</td></tr>
        </tbody>
        </table>
        <div className="text-right">
          <button className="btn btn-default" onClick={this.handleBtnClick} disabled={this.state.btnDisabled}>config profile</button>
        </div>
      </div>
    );
  }
});


module.exports = CameraProfileComponent;


