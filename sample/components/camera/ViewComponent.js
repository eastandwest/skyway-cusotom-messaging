var React = require('react')
  , VideoViewComponent = require('./Video')
  , ProfileViewComponent = require('./Profile')
  , PeerCustomMesg = require('../../../lib/modules/PeerCustomMesg')

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
            <ProfileViewComponent pcm={this.state.pcm} />
            <VideoViewComponent peer={this.state.peer} pcm={this.state.pcm} />
          </div>
        );
      } else { return (
        <span>Connecting server...</span>
      ); };
    })();
    return (
      <div className="CameraView">
        {showCameraView}
     </div>
    )
  }
});


var CameraView = React.createFactory(CameraViewComponent);

module.exports = CameraView;
