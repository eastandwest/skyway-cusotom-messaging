var React = require('react')
  , PeerCustomMesg = require('../../../lib/index')
  , MonitorProfileComponent = require('./ProfileComponent')
  , MonitorVideoComponent = require('./VideoComponent')


var MonitorViewComponent = React.createClass({
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
    // make Grid IDs from this.state.camera_ids
    var createGridIds = () => {
      var arr = [], subarr = [], cursor = 0;
      for(var key in this.state.camera_ids) {
        cursor++;
        if( (key % 3) === 0 ) subarr.length = 0;
        subarr.push(this.state.camera_ids[key]);
        if( (key % 3) === 2 || this.state.camera_ids.length === cursor ) arr.push(JSON.parse(JSON.stringify(subarr)));
      }
      return arr;
    }

    //
    var gridNodes = (() => {
      var gridIds = createGridIds()
        , pcm = this.state.pcm
      console.log(gridIds);

      return gridIds.map((subarr, key) => {
        var monitorNodes = subarr.map((camera_id, key) => {
          return (
            <div key={key} className="col-md-4 box-cam">
                <MonitorProfileComponent cameraId={camera_id} pcm={this.state.pcm} />
                <MonitorVideoComponent cameraId={camera_id} pcm={this.state.pcm} peer={this.state.peer} />
            </div>
          )
        });

        return(
          <div key={key} className="row row-cam">
          {monitorNodes}
          </div>
        )
      });
    })();

    return (
      <div className="monitorViewComponent">
        <h3>MonitorList</h3>
        {gridNodes}
      </div>
    )
  }
});

var MonitorView = React.createFactory(MonitorViewComponent);

module.exports = MonitorView;
