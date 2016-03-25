var React = require('react')
  , CameraVideoComponent = require('./VideoComponent')
  , CameraProfileComponent = require('./ProfileComponent')


require('../css/default.css')
require('webrtc-adapter')


///////////////////////////////////////////////////////
// create react class
var CameraViewComponent = React.createClass({
  render() {
    return(
      <div className="cameraViewComponent">
        <div>
          <div className="panel panel-primary">
            <div className="panel-heading">
              <h3 className="panel-title">Local Camera View</h3>
            </div>
            <div className="panel-body">
            <CameraProfileComponent model={this.props.model} appState={this.props.appState} />
            <CameraVideoComponent model={this.props.model}  />
            </div>
          </div>
        </div>
      </div>
    )
  }
});


var CameraView = React.createFactory(CameraViewComponent);

module.exports = CameraView;
