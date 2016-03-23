var React = require('react')
  , MonitorProfileComponent = require('./ProfileComponent')
  , MonitorVideoComponent = require('./VideoComponent')

require('react.backbone')

require('../css/default.css');

///////////////////////////////////////////////////////
// react class definition
var MonitorViewComponent = React.createBackboneClass({
  // create 3 cols arr
  createGridArray(monitors) {
    var arr = [], subarr = new Array();
    for(var i = 0, len = monitors.length; i < len; i++) {
      // push monitor into subarr
      var monitor = monitors.models[i];
      subarr.push(monitor);

      // it it reaches 3 cols or final
      if( (i % 3) === 2 || len === (i + 1) ) {
        // clone subarray then push into arr
        arr.push(subarr);
        subarr = new Array();
      }
    }
    return arr;
  },
  render() {
    var monitors = this.getCollection();

    var monitorList = this.createGridArray(monitors).map((cols, key) => {
      return (
        <div key={key} className="row row-cam">
        { cols.map((monitor, key) => {
          return (
            <div key={key} className="col-md-4 box-cam">
              <div className="panel panel-primary">
                <div className="panel-heading">
                  <h3 className="panel-title">Remote Camera View</h3>
                </div>
                <div className="panel-body">
                  <MonitorProfileComponent model={monitor} />
                  <MonitorVideoComponent model={monitor} peer={monitors.peer} pcm={monitors.pcm} />
                </div>
              </div>
            </div>
          )
        })}
        </div>
      )
    });

    return (
      <div className="monitorViewComponent">
        <h3>Monitors View</h3>
        {monitorList}
      </div>
    )
  }
});

var MonitorView = React.createFactory(MonitorViewComponent);

module.exports = MonitorView;
