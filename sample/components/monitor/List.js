var React = require('react')
  , MonitorProfileComponent = require('./Profile')
  , MonitorCameraComponent = require('./Camera')
  , PeerCustomMesg = require('../../../lib/modules/PeerCustomMesg')


var MonitorListComponent = React.createClass({
  getInitialState() {
    return {
      peer: null
      , myid: null
      , pcm: null
      , camera_ids: []
    };
  },
  componentDidMount() {
    if(!this.props.apikey) {
      console.log(this);
      console.log(this.props, "error");
      return false;
    }
    this.state.peer = new Peer({"key":  this.props.apikey});
    // when established connection to SkyWay signaling server
    this.state.peer.on("open", (id) => {
      this.setState({"myid": id});
      this.state.pcm = new PeerCustomMesg(this.state.peer);

      // show camera list
      this.getCamList();
    });
  },
  getCamList() {
    this.state.peer.listAllPeers((list) => {
      list.forEach((camPeerID) => {
        console.log(camPeerID);
        if(camPeerID.indexOf("camera") === 0) {
          var camera_ids = this.state.camera_ids;
          var new_camera_ids = camera_ids.concat([camPeerID]);
          this.setState({"camera_ids": new_camera_ids});
        };
      })
    })
  },
  monitorNodes() {
 },
  render() {

    var testNode = () => {
      if(true) {
        return (<span>hogehoge</span>);
      } else {
        return (<div>hello, world</div>);
      }
    }

    var monitorNodes = this.state.camera_ids.map((camera_id, key) => {

      var key_ = parseInt(key);
      var begin_row = (key_ % 3) === 0;
      var end_row = (key_ % 3) === 2 || this.state.camera_ids.length === key_ + 1;
      // TODO:
      // <div className="row row-cam"></div>
      return (
        <div key={key} begin_row={begin_row} className="col-md-4 box-cam">
          <MonitorProfileComponent cameraId={camera_id} pcm={this.state.pcm} />
          <MonitorCameraComponent cameraId={camera_id} pcm={this.state.pcm} peer={this.state.peer} />
        </div>
      )
    });

    return (
      <div className="monitorList">
        <h3>MonitorList</h3>
        <div className="row row-cam">
          {monitorNodes}
        </div>
      </div>
    )
  }
});


var MonitorList = React.createFactory(MonitorListComponent);

module.exports = MonitorList;
