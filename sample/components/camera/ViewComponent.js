var React = require('react')
  , CameraVideoComponent = require('./VideoComponent')
  , CameraProfileComponent = require('./ProfileComponent')


require('../css/default.css')
require('webrtc-adapter')


///////////////////////////////////////////////////////
// create react class
var CameraViewComponent = React.createClass({
  render() {
    var showCameraView = () => {
      if(this.props.peer) {
        return(
          <div>
            <div className="panel panel-primary">
              <div className="panel-heading">
                <h3 className="panel-title">Local Camera View</h3>
              </div>
              <div className="panel-body">
              <CameraProfileComponent camera={this.props.camera} />
              <CameraVideoComponent camera={this.props.camera} peer={this.props.peer} />
              </div>
            </div>
          </div>
        );
      } else { return (
        <span>Connecting server...</span>
      ); };
    };
    return (
      <div className="cameraViewComponent">
        {showCameraView()}
     </div>
    )
  }
});


var CameraView = React.createFactory(CameraViewComponent);

module.exports = CameraView;
