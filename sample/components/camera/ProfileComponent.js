var React = require('react');

require('react.backbone'); // Backbone plugin for React

var CameraProfileComponent = React.createBackboneClass({
  mixins: [
    // React.BackboneMixin("config", "name:change")
    React.BackboneMixin("camera")
  ],
  render() {
    return (
      <div className="cameraProfileComponent">
         <table className="table">
          <tbody>
            <tr><td><strong>name</strong></td><td>{this.props.camera.get("name")}</td></tr>
            <tr><td><strong>location</strong></td><td>{this.props.camera.get("location")}</td></tr>
          </tbody>
         </table>
      </div>
    );
  }
});


module.exports = CameraProfileComponent;


