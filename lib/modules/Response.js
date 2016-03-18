/* Response.js */

var EventEmitter = require("events")
  , util = require("./util")
  , validator = require("./validator")

class Response extends EventEmitter {
  constructor(param) {
    super();
    // if validation fails, throw error.
    if(!this._validate_param(param)) throw "Response: parameter for constructor is not valid";

    this.transaction_id = param.transaction_id;
    this.created_at = util.make_utc_timestamp();
    this.dst = param.dst;
    this.method = param.method;
    this.resource = param.resource;
    this.parameter = param.parameter;
    this.data = {
      "status": "200",
      "name": "response",
      "method" : param.method,
      "resource" : param.resource,
      "transaction_id" : param.transaction_id,
      "response": ""
    };
  }

  status(status_code) {
    if(typeof(status_code) !== "number") throw "status code should be number";
    if( status_code < 100 || status_code > 999 ) throw "status code should be between 100 - 999";
    this.data.status = status_code.toString();
  }

  write(data) {
    if(data === null || data === undefined) throw "data should be specified";
    // todo: validation (falsy check?)
    //
    this.data.response = data;
  }

  end() {
    this.emit("send-ready");
  }

  // for internal

  _validate_param(param) {
    if( !(param.transaction_id && validator.is_transaction_id(param.transaction_id)) ) return false;
    if( !(!!param.method && typeof(param.method) === "string" ) ) return false;
    if( !param.method.match(/^(GET|POST|PUT|DELETE)$/) ) return false;

    if( !(!!param.dst && typeof(param.dst) === "string") ) return false;
    if( !(!!param.resource && typeof(param.resource) === "string" && param.resource.match(/^\/[0-9a-zA-Z-]+$/) ) ) return false;

    return true;
  }

}

module.exports = Response;
