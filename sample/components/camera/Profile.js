var React = require('react');

var ProfileViewComponent = React.createClass({
  getInitialState(){
    return {
      name: null,
      location: null
    }
  },
  componentDidMount(){
    this.setNameAndLocationForDemo();
    this.setPCMHandler();
  },
  setNameAndLocationForDemo() {
    var location = (() => {
      var locations = ["tokyo", "oosaka", "palo alto", "mountain view"];
      var len = locations.length
        , idx = Math.floor(Math.random() * len);
      return locations[idx]
    })();

    var name = (() => {
      var names = ["Office", "Home", "Park", "restaulant"];
      var len = names.length
        , idx = Math.floor(Math.random() * len);
      return names[idx]
    })();

    this.setState({"name": name, "location": location});
  },
  setPCMHandler() {
    this.props.pcm.on('request', this.handleMesg);
  },
  handleMesg(req, res) {
    if(req.method === "GET" && req.resource === "/profile") {
      res.write({"name": this.state.name, "location": this.state.location});
      res.end();
    }
  },
  render() {
    return (
      <div className="ProfileViewComponent">
         <table className="table">
          <tbody>
            <tr><td><strong>location</strong></td><td>{this.state.location}</td></tr>
            <tr><td><strong>name</strong></td><td>{this.state.name}</td></tr>
          </tbody>
         </table>
      </div>
    );
  }
});


module.exports = ProfileViewComponent;


