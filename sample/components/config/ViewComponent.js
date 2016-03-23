var React = require('react')
  , ConfigFormComponent = require('./FormComponent')

var ConfigViewComponent = React.createClass({
  componentDidMount(){
    console.log(this.props.model);
  },
  render() {
    return (
      <div className="configViewComponent">
        <ConfigFormComponent camera={this.props.camera} />
      </div>
    );
  }
});

var ConfigView = React.createFactory(ConfigViewComponent);

module.exports = ConfigView;
