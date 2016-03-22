var React = require('react')

var MonitorProfileComponent = React.createClass({
  getInitialState() {
    return {
      name: "",
      location: ""
    }
  },
  componentDidMount() {
    this.props.pcm.get(this.props.cameraId, '/profile').then((data) => {
      console.log(data.response);
      this.setState({"name": data.response.name, "location": data.response.location});
    });
  },

  render() {
    return (
      <div className="monitorProfileComponent">
        <table className="table">
          <tbody>
            <tr><td><strong>name</strong></td><td>{this.state.name}</td></tr>
            <tr><td><strong>location</strong></td><td>{this.state.location}</td></tr>
          </tbody>
        </table>
      </div>
    )
  }
});

module.exports = MonitorProfileComponent;
