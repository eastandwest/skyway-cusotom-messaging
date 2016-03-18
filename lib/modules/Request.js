/* Request.js */

var EventEmitter = require("events")
  , util = require("./util")

class Request extends EventEmitter {
  constructor(param) {
    super();

    // if validation fails, throw error.
    if(!this.validate_param(param)) throw "Request: parameter for constructor is not valid";

    this.transaction_id = util.make_transaction_id();
    this.created_at = util.make_utc_timestamp();
    this.dst = param.dst;
    this.method = param.method;
    this.resource = param.resource;
    this.parameter = param.parameter;
    this.resolve = param.resolve;
    this.reject = param.reject;
    this.data = {
      "name": "request",
      "method" : param.method,
      "resource" : param.resource,
      "parameter" : param.parameter,
      "transaction_id" : this.transaction_id
    };
  }

  validate_param(param) {
    if( !(!!param.method && typeof(param.method) === "string" ) ) return false;

    param.method = param.method.toUpperCase();

    if( !param.method.match(/^(GET|POST|PUT|DELETE)$/) ) return false;
    if( !(!!param.dst && typeof(param.dst) === "string") ) return false;
    if( !(!!param.resource && typeof(param.resource) === "string" && param.resource.match(/^\/[0-9a-zA-Z-]+$/) ) ) return false;
    if( !(!param.resolve || typeof(param.resolve) === "function") ) return false;
    if( !(!param.reject || typeof(param.reject) === "function") ) return false;

    return true;
  }
}

module.exports = Request;
