var React = require('react')
  , ConfigFormComponent = require('./FormComponent')

var ConfigViewComponent = React.createClass({
  render() {
    return (
      <div className="configViewComponent">
        <ConfigFormComponent model={this.props.model} appState={this.props.appState}/>
      </div>
    );
  }
});

var ConfigView = React.createFactory(ConfigViewComponent);

module.exports = ConfigView;
