var React = require('react')

require('react.backbone')

var MonitorProfileComponent = React.createBackboneClass({
  render() {
    var monitor = this.getModel();
    return (
      <div className="monitorProfileComponent">
        <table className="table">
          <tbody>
            <tr><td><strong>peerid of camera</strong></td><td>{monitor.get('camPeerID')}</td></tr>
            <tr><td><strong>owner name</strong></td><td>{monitor.get('name')}</td></tr>
            <tr><td><strong>location</strong></td><td>{monitor.get('location')}</td></tr>
          </tbody>
        </table>
      </div>
    )
  }
});

module.exports = MonitorProfileComponent;

