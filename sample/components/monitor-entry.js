if(process.env.NODENV==="sample") {
  require("../monitor.html"); // this includes html file in watcher list.
}

var React = require('react')
  , ReactDOM = require('react-dom')
  , MonitorView = require('./monitor/ViewComponent')


var monitorView = MonitorView({"apikey": "dbe1b9ed-5a52-4488-a592-c451daf74206"});


ReactDOM.render(monitorView, document.getElementById("monitor-list"));
