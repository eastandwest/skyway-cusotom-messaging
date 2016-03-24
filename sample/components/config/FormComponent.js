var React = require('react')
  , _ = require('underscore')

require('react.backbone')

var ConfigFormComponent = React.createBackboneClass({
  mixins: [
    React.BackboneMixin("appState")
  ],
  getInitialState(){
    return {
      "name": this.getModel().get("name"),
      "location": this.getModel().get("location"),
      "passcode": this.getModel().get("passcode"),
      "error_msg": null
    }
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



    var attrs = {"id": 1, "name": this.state.name, "location": this.state.location, "passcode": this.state.passcode };
    var err = this.getModel().preValidate(attrs);

    if(!err) {
      // case attributes are valid
      this.getModel().save(attrs);
      this.props.appState.set({"config": "submitted"});
      this.setState({error_msg: null});
    } else {
      this.setState({error_msg: "[Error] " + _.values(err).join(", ")});
    }
  },
  render() {
    return (
      <div className="ConfigFormComponent panel panel-primary">
        <div className="panel-heading">
          <h3 className="panel-title">Configuration</h3>
        </div>
        <div className="panel-body">
        {( () => { if(this.state.error_msg) return (
          <div className="alert alert-danger" role="alert">{this.state.error_msg}</div>
          )})()}
          <form className="form-horizontal" onSubmit={this.handleSubmit}>
            <fieldset className="form-group row">
              <label className="col-sm-4 control-label" htmlFor="config-form-group-name">Name</label>
              <div className="col-sm-7">
                <input type="text" className="form-control" id="config-form-group-name" name="name" defaultValue={this.state.name} onChange={this.handleNameChange} placeholder="Your name (e.g. Ken)" required />
              </div>
            </fieldset>
            <fieldset className="form-group row">
              <label className="col-sm-4 control-label" htmlFor="config-form-group-location">Location</label>
              <div className="col-sm-7">
                <input type="text" className="form-control" id="config-form-group-location" name="location" defaultValue={this.state.location} onChange={this.handleLocationChange} placeholder="Your location (e.g. San Francisco)" required />
              </div>
            </fieldset>
            <fieldset className="form-group row">
              <label className="col-sm-4 control-label" htmlFor="config-form-group-passcode">Pass Code (MUST be 6 length digit)</label>
              <div className="col-sm-7">
                <input type="text" className="form-control" id="config-form-group-passcode" name="passcode" defaultValue={this.state.passcode} onChange={this.handlePasscodeChange} placeholder="6 length digit (e.g. 123456)" required />
              </div>
            </fieldset>
            <fieldset className="form-group row">
              <div className="col-sm-offset-4 col-sm-7">
                <input className="btn btn-primary" type="submit" value="Submit" />
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    );
  }
});

module.exports = ConfigFormComponent;
