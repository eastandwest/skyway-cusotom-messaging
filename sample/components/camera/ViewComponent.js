var React = require('react')
  , PeerCustomMesg = require('../../../lib/index')
  , CameraVideoComponent = require('./VideoComponent')
  , CameraProfileComponent = require('./ProfileComponent')

require('../css/default.css')


///////////////////////////////////////////////////////
// create react class
var CameraViewComponent = React.createClass({
  getInitialState() {
    return {
      peer: null,
      pcm: null
    }
  },
  makeRandom(seed) {
    return Math.floor(Math.random(seed)*seed);
  },
  componentDidMount() {
    this.state.apikey = this.props.apikey;
    this.state.myid = "camera" + this.makeRandom(10000000000);

    var peer = new Peer(this.state.myid, {"key": this.state.apikey});

    peer.on('open', (id) => {
      var pcm = new PeerCustomMesg(peer);
      this.setState({"peer": peer, "pcm": pcm});
    });
  },
  render() {

    var showCameraView = (() => {
      if(this.state.peer && this.state.pcm) {
        return(
          <div>
            <div className="panel panel-primary">
              <div className="panel-heading">
                <h3 className="panel-title">Local Camera View</h3>
              </div>
              <div className="panel-body">
              <CameraProfileComponent pcm={this.state.pcm} />
              <CameraVideoComponent peer={this.state.peer} pcm={this.state.pcm} />
              </div>
            </div>
          </div>
        );
      } else { return (
        <span>Connecting server...</span>
      ); };
    })();
    return (
      <div className="cameraViewComponent">
        {showCameraView}
     </div>
    )
  }
});


var CameraView = React.createFactory(CameraViewComponent);

module.exports = CameraView;
