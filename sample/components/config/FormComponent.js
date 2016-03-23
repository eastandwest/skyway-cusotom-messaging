var React = require('react')
require('react.backbone')

var ConfigFormComponent = React.createBackboneClass({
  mixins: [
    React.BackboneMixin("camera")
  ],
  getInitialState(){
    return {
      "name": this.props.camera.get("name"),
      "location": this.props.camera.get("location"),
      "passcode": this.props.camera.get("passcode"),
    }
  },
  componentDidMount(){
  },
  handleNameChange(e) {
    this.setState({"name": e.target.value});
  },
  handleLocationChange(e) {
    this.setState({"location": e.target.value});
  },
  handlePasscodeChange(e) {
    this.setState({"passcode": e.target.value});
  },
  handleSubmit(e) {
    e.preventDefault();
    var formObj = e.target;

    this.props.camera.save({"id": 1, "name": this.state.name, "location": this.state.location, "passcode": this.state.passcode });
  },
  render() {
    return (
      <div className="configFormComponent">
        <form onSubmit={this.handleSubmit}>
          <input type="text" name="name" defaultValue={this.state.name} onChange={this.handleNameChange} placeholder="Your name (e.g. Ken)" required />
          <input type="text" name="location" defaultValue={this.state.location} onChange={this.handleLocationChange} placeholder="Your location (e.g. San Francisco)" required />
          <input type="text" name="passcode" defaultValue={this.state.passcode} onChange={this.handlePasscodeChange} placeholder="digit 6-length pass code (e.g. 123456)" required />
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
});

module.exports = ConfigFormComponent;
