require("../monitor.html"); // this includes html file in watcher list.

var React = require('react')
  , ReactDOM = require('react-dom')
  , MonitorList = require('./monitor/List')


var monitorList = MonitorList({"apikey": "dbe1b9ed-5a52-4488-a592-c451daf74206"});


ReactDOM.render(monitorList, document.getElementById("monitor-list"));
