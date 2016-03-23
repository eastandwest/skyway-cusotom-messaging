var React = require('react');

require('react.backbone'); // Backbone plugin for React

var CameraProfileComponent = React.createBackboneClass({
  render() {
    return (
      <div className="cameraProfileComponent">
         <table className="table">
          <tbody>
            <tr><td><strong>name</strong></td><td>{this.getModel().get("name")}</td></tr>
            <tr><td><strong>location</strong></td><td>{this.getModel().get("location")}</td></tr>
          </tbody>
         </table>
      </div>
    );
  }
});


module.exports = CameraProfileComponent;


