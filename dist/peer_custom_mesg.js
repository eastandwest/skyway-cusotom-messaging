/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "dist";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var PeerCustomMesg = __webpack_require__(1);
	
	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
	  module.exports = PeerCustomMesg;
	} else {
	  window.PeerCustomMesg = PeerCustomMesg;
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _events = __webpack_require__(2);
	
	var _events2 = _interopRequireDefault(_events);
	
	var _validator = __webpack_require__(3);
	
	var _validator2 = _interopRequireDefault(_validator);
	
	var _Request = __webpack_require__(4);
	
	var _Request2 = _interopRequireDefault(_Request);
	
	var _Response = __webpack_require__(10);
	
	var _Response2 = _interopRequireDefault(_Response);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	var PeerCustomMesg = function (_EventEmitter) {
	  _inherits(PeerCustomMesg, _EventEmitter);
	
	  function PeerCustomMesg(peer, custom_type /* optional */) {
	    _classCallCheck(this, PeerCustomMesg);
	
	    // when extends is used, super() should be called
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PeerCustomMesg).call(this));
	
	    if (!_validator2.default.is_peer_object(peer)) throw "parameter peer does not valid object";
	    if (!!custom_type && !_validator2.default.is_string(custom_type)) throw "parameter custom_type should be string";
	
	    _this.peer = peer; // skyway server connection instance
	    _this.custom_type = custom_type ? "X_" + custom_type.toUpperCase() : "X_CUSTOMMESG";
	
	    _this.objRequests = {};
	
	    // message handler for custom message
	    _this.peer.socket.on("message", function (data) {
	      // check if type field is peerjs signaling type
	      // for sinon test, this case emit 'signalling-mesg' event
	      if (_validator2.default.is_signalling_type(data.type)) {
	        _this.emit("signalling-mesg", data.type);
	        return;
	      }
	
	      // check if type field is correct
	      if (data.type !== _this.custom_type) throw "received type does not match with custom_type: " + data.type;
	
	      // suppress error when type is for signaling message
	      if (!_validator2.default.is_peerjs_format(data)) throw "data type is not valid peerjs format";
	
	      if (data.payload.name && data.payload.name === "request" && data.payload.method && data.payload.resource && data.payload.transaction_id) {
	        // operate it as request
	        var req = data.payload;
	
	        // create Response instance and set event handler when send-ready is called (res.end())
	        //
	
	        var param = {
	          "transaction_id": req.transaction_id,
	          "dst": data.src,
	          "method": req.method,
	          "resource": req.resource,
	          "parameter": req.parameter
	        };
	        var res = new _Response2.default(param).once("send-ready", function () {
	          _this.send(res.dst, res.data);
	        });
	
	        // inject data.transaction_id & name
	        var req_ = {
	          "method": req.method,
	          "resource": req.resource,
	          "parameter": req.parameter
	        };
	
	        _this.emit("request", req_, res);
	      } else if (data.payload.name && data.payload.name === "response" && data.payload.status && data.payload.method && data.payload.resource && data.payload.transaction_id && data.payload.response) {
	        // operate it as response
	        var res = data.payload;
	
	        // throw if res.transaction_id does not exist in objRequests.
	        if (!_this.objRequests[res.transaction_id]) throw "transaction_id does not exist: " + res.transaction_id;
	
	        // pickup request instance from objRequests ( do not forget to remoe from it)
	        var req = _this.objRequests[res.transaction_id];
	
	        // throw if data.method does not match with requests.method.
	        if (res.method !== req.method) throw "res.method does not match with req.method: " + res.method;
	
	        // throw if data.resource does not match with requests.resource.
	        if (res.resource !== req.resource) throw "res.resource does not match with req.resource: " + res.resource;
	
	        // inject data.response.transaction_id & name
	        var res_ = {
	          "status": res.status,
	          "method": res.method,
	          "resource": res.resource,
	          "parameter": res.parameter,
	          "response": res.response
	        };
	
	        // emit resolve function when status === 200 with data.response, otherwise reject
	        if (res_.status === "200") {
	          req.resolve(res_);
	        } else {
	          req.reject(res_.status + " : " + res_.response);
	        }
	
	        delete _this.objRequests[res.transaction_id];
	      } else {
	        _this.emit("message", { "srcPeerID": data.src, "data": data.payload });
	      }
	    });
	    return _this;
	  }
	
	  // send custom message
	
	
	  _createClass(PeerCustomMesg, [{
	    key: 'send',
	    value: function send(dst, mesg) {
	      if (!_validator2.default.is_peerid(dst)) throw "parameter dst is not valid peer id";
	      if (_validator2.default.is_falsy(mesg)) throw "parameter mesg is falsy";
	
	      this.peer.socket.send({
	        "type": this.custom_type,
	        "payload": mesg,
	        "dst": dst
	      });
	    }
	
	    /////////////////////////////////////////////
	    // rpc methods
	
	    /**
	     * send procedure call to target custom message object.
	     *
	     * method : string of rpc method  (e.g. "GET", "STOP", etc.
	     * dest : destination peer id  (e.g. "a23klf2"
	     * resource : string begin with /  (e.g. /profiles
	     * parameter (optional) : request parameter (string, number, object)
	     *
	     **/
	
	  }, {
	    key: 'rpc',
	    value: function rpc(method, dst, resource, parameter) {
	      var _this2 = this;
	
	      // validation is done inside Request constructor (when fails, it throw error)
	      var req = new _Request2.default({
	        "method": method,
	        "dst": dst,
	        "resource": resource,
	        "parameter": parameter,
	        "resolve": null,
	        "reject": null
	      });
	
	      var promise = new Promise(function (resolve, reject) {
	        // set resolve & reject in side Request object
	        req.resolve = resolve;
	        req.reject = reject;
	
	        var transaction_id = req.transaction_id;
	
	        _this2.objRequests[transaction_id] = req;
	        _this2.send(dst, req.data);
	        _this2.emit("rpc-called", { "method": method, "resource": resource, "dst": dst });
	      });
	
	      return promise;
	    }
	
	    // shortcut to GET
	
	  }, {
	    key: 'get',
	    value: function get(dst, resource, parameter) {
	      return this.rpc("GET", dst, resource, parameter);
	    }
	  }]);
	
	  return PeerCustomMesg;
	}(_events2.default);
	
	module.exports = PeerCustomMesg;

/***/ },
/* 2 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;
	
	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;
	
	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;
	
	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;
	
	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};
	
	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;
	
	  if (!this._events)
	    this._events = {};
	
	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      }
	      throw TypeError('Uncaught, unspecified "error" event.');
	    }
	  }
	
	  handler = this._events[type];
	
	  if (isUndefined(handler))
	    return false;
	
	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }
	
	  return true;
	};
	
	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;
	
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  if (!this._events)
	    this._events = {};
	
	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);
	
	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];
	
	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }
	
	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }
	
	  return this;
	};
	
	EventEmitter.prototype.on = EventEmitter.prototype.addListener;
	
	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  var fired = false;
	
	  function g() {
	    this.removeListener(type, g);
	
	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }
	
	  g.listener = listener;
	  this.on(type, g);
	
	  return this;
	};
	
	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;
	
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');
	
	  if (!this._events || !this._events[type])
	    return this;
	
	  list = this._events[type];
	  length = list.length;
	  position = -1;
	
	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	
	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }
	
	    if (position < 0)
	      return this;
	
	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }
	
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }
	
	  return this;
	};
	
	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;
	
	  if (!this._events)
	    return this;
	
	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }
	
	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }
	
	  listeners = this._events[type];
	
	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];
	
	  return this;
	};
	
	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};
	
	EventEmitter.prototype.listenerCount = function(type) {
	  if (this._events) {
	    var evlistener = this._events[type];
	
	    if (isFunction(evlistener))
	      return 1;
	    else if (evlistener)
	      return evlistener.length;
	  }
	  return 0;
	};
	
	EventEmitter.listenerCount = function(emitter, type) {
	  return emitter.listenerCount(type);
	};
	
	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	
	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	
	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	
	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ },
/* 3 */
/***/ function(module, exports) {

	"use strict";
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var validator = {
	  is_boolean: function is_boolean(val) {
	    return typeof val === "boolean";
	  },
	
	  is_falsy: function is_falsy(val) {
	    if (val === 0) return false;
	
	    return !val;
	  },
	
	  is_transaction_id: function is_transaction_id(candidate) {
	    if (typeof candidate !== "string") return false;
	
	    return !!candidate.match(/^[a-z0-9]{32}$/);
	  },
	
	  // check data.type is for signaling or not. In case of such a type is transmitted and
	  // it is not taken into account with invalid message (since it does not match extensive type)
	  // it show up annoying error in console. To prevent this, it is checked as signaling message
	  // or not.
	  is_signalling_type: function is_signalling_type(type) {
	    if (typeof type === 'string' && type.match(/^(PING|OFFER|ANSWER|CANDIDATE)$/)) {
	      return true;
	    } else {
	      return false;
	    }
	  },
	
	  is_peer_object: function is_peer_object(obj) {
	    return !!(obj && obj.toString && obj.toString() === "[object Object]");
	  },
	
	  // min and max is optional
	  is_string: function is_string(str, min, max) {
	    if (typeof str !== "string") return false;
	
	    var _min = typeof min === "number",
	        _max = typeof max === "number";
	
	    if ((_min || _max) && !(_min && _max)) return false;
	
	    if (typeof min === "number" || typeof max === "number") {
	      if (min === max) return false;
	      if (max < min) return false;
	
	      if (str.length < min || str.length > max) return false;
	    }
	
	    return true;
	  },
	
	  is_peerid: function is_peerid(id) {
	    if (typeof id !== 'string') return false;
	    if (id.length === 0) return false;
	
	    return true;
	  },
	
	  is_object: function is_object(obj) {
	    if (validator.is_falsy(obj)) return false;
	    return (typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object" ? true : false;
	  },
	
	  is_peerjs_format: function is_peerjs_format(obj) {
	    if (typeof obj.type !== "string") return false;
	    if (validator.is_falsy(obj.payload)) return false;
	    if (!validator.is_peerid(obj.dst)) return false;
	    if (!validator.is_peerid(obj.src)) return false;
	    if (obj.dst === obj.src) return false;
	
	    return true;
	  }
	};
	
	module.exports = validator;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/* Request.js */
	
	var EventEmitter = __webpack_require__(2),
	    util = __webpack_require__(5);
	
	var Request = function (_EventEmitter) {
	  _inherits(Request, _EventEmitter);
	
	  function Request(param) {
	    _classCallCheck(this, Request);
	
	    // if validation fails, throw error.
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Request).call(this));
	
	    if (!_this.validate_param(param)) throw "Request: parameter for constructor is not valid";
	
	    _this.transaction_id = util.make_transaction_id();
	    _this.created_at = util.make_utc_timestamp();
	    _this.dst = param.dst;
	    _this.method = param.method;
	    _this.resource = param.resource;
	    _this.parameter = param.parameter;
	    _this.resolve = param.resolve;
	    _this.reject = param.reject;
	    _this.data = {
	      "name": "request",
	      "method": param.method,
	      "resource": param.resource,
	      "parameter": param.parameter,
	      "transaction_id": _this.transaction_id
	    };
	    return _this;
	  }
	
	  _createClass(Request, [{
	    key: "validate_param",
	    value: function validate_param(param) {
	      if (!(!!param.method && typeof param.method === "string")) return false;
	
	      param.method = param.method.toUpperCase();
	
	      if (!param.method.match(/^(GET|POST|PUT|DELETE)$/)) return false;
	      if (!(!!param.dst && typeof param.dst === "string")) return false;
	      if (!(!!param.resource && typeof param.resource === "string" && param.resource.match(/^\/[0-9a-zA-Z-]+$/))) return false;
	      if (!(!param.resolve || typeof param.resolve === "function")) return false;
	      if (!(!param.reject || typeof param.reject === "function")) return false;
	
	      return true;
	    }
	  }]);
	
	  return Request;
	}(EventEmitter);
	
	module.exports = Request;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _md = __webpack_require__(6);
	
	var _md2 = _interopRequireDefault(_md);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var util = {
	  // it will be copied to request and response object library
	  make_transaction_id: function make_transaction_id() {
	    return (0, _md2.default)(util.make_utc_timestamp());
	  },
	
	  // return milisec order timestamp in UTC
	  make_utc_timestamp: function make_utc_timestamp() {
	    return Date.now().toString();
	  }
	};
	
	module.exports = util;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	(function(){
	  var crypt = __webpack_require__(7),
	      utf8 = __webpack_require__(8).utf8,
	      isBuffer = __webpack_require__(9),
	      bin = __webpack_require__(8).bin,
	
	  // The core
	  md5 = function (message, options) {
	    // Convert to byte array
	    if (message.constructor == String)
	      if (options && options.encoding === 'binary')
	        message = bin.stringToBytes(message);
	      else
	        message = utf8.stringToBytes(message);
	    else if (isBuffer(message))
	      message = Array.prototype.slice.call(message, 0);
	    else if (!Array.isArray(message))
	      message = message.toString();
	    // else, assume byte array already
	
	    var m = crypt.bytesToWords(message),
	        l = message.length * 8,
	        a =  1732584193,
	        b = -271733879,
	        c = -1732584194,
	        d =  271733878;
	
	    // Swap endian
	    for (var i = 0; i < m.length; i++) {
	      m[i] = ((m[i] <<  8) | (m[i] >>> 24)) & 0x00FF00FF |
	             ((m[i] << 24) | (m[i] >>>  8)) & 0xFF00FF00;
	    }
	
	    // Padding
	    m[l >>> 5] |= 0x80 << (l % 32);
	    m[(((l + 64) >>> 9) << 4) + 14] = l;
	
	    // Method shortcuts
	    var FF = md5._ff,
	        GG = md5._gg,
	        HH = md5._hh,
	        II = md5._ii;
	
	    for (var i = 0; i < m.length; i += 16) {
	
	      var aa = a,
	          bb = b,
	          cc = c,
	          dd = d;
	
	      a = FF(a, b, c, d, m[i+ 0],  7, -680876936);
	      d = FF(d, a, b, c, m[i+ 1], 12, -389564586);
	      c = FF(c, d, a, b, m[i+ 2], 17,  606105819);
	      b = FF(b, c, d, a, m[i+ 3], 22, -1044525330);
	      a = FF(a, b, c, d, m[i+ 4],  7, -176418897);
	      d = FF(d, a, b, c, m[i+ 5], 12,  1200080426);
	      c = FF(c, d, a, b, m[i+ 6], 17, -1473231341);
	      b = FF(b, c, d, a, m[i+ 7], 22, -45705983);
	      a = FF(a, b, c, d, m[i+ 8],  7,  1770035416);
	      d = FF(d, a, b, c, m[i+ 9], 12, -1958414417);
	      c = FF(c, d, a, b, m[i+10], 17, -42063);
	      b = FF(b, c, d, a, m[i+11], 22, -1990404162);
	      a = FF(a, b, c, d, m[i+12],  7,  1804603682);
	      d = FF(d, a, b, c, m[i+13], 12, -40341101);
	      c = FF(c, d, a, b, m[i+14], 17, -1502002290);
	      b = FF(b, c, d, a, m[i+15], 22,  1236535329);
	
	      a = GG(a, b, c, d, m[i+ 1],  5, -165796510);
	      d = GG(d, a, b, c, m[i+ 6],  9, -1069501632);
	      c = GG(c, d, a, b, m[i+11], 14,  643717713);
	      b = GG(b, c, d, a, m[i+ 0], 20, -373897302);
	      a = GG(a, b, c, d, m[i+ 5],  5, -701558691);
	      d = GG(d, a, b, c, m[i+10],  9,  38016083);
	      c = GG(c, d, a, b, m[i+15], 14, -660478335);
	      b = GG(b, c, d, a, m[i+ 4], 20, -405537848);
	      a = GG(a, b, c, d, m[i+ 9],  5,  568446438);
	      d = GG(d, a, b, c, m[i+14],  9, -1019803690);
	      c = GG(c, d, a, b, m[i+ 3], 14, -187363961);
	      b = GG(b, c, d, a, m[i+ 8], 20,  1163531501);
	      a = GG(a, b, c, d, m[i+13],  5, -1444681467);
	      d = GG(d, a, b, c, m[i+ 2],  9, -51403784);
	      c = GG(c, d, a, b, m[i+ 7], 14,  1735328473);
	      b = GG(b, c, d, a, m[i+12], 20, -1926607734);
	
	      a = HH(a, b, c, d, m[i+ 5],  4, -378558);
	      d = HH(d, a, b, c, m[i+ 8], 11, -2022574463);
	      c = HH(c, d, a, b, m[i+11], 16,  1839030562);
	      b = HH(b, c, d, a, m[i+14], 23, -35309556);
	      a = HH(a, b, c, d, m[i+ 1],  4, -1530992060);
	      d = HH(d, a, b, c, m[i+ 4], 11,  1272893353);
	      c = HH(c, d, a, b, m[i+ 7], 16, -155497632);
	      b = HH(b, c, d, a, m[i+10], 23, -1094730640);
	      a = HH(a, b, c, d, m[i+13],  4,  681279174);
	      d = HH(d, a, b, c, m[i+ 0], 11, -358537222);
	      c = HH(c, d, a, b, m[i+ 3], 16, -722521979);
	      b = HH(b, c, d, a, m[i+ 6], 23,  76029189);
	      a = HH(a, b, c, d, m[i+ 9],  4, -640364487);
	      d = HH(d, a, b, c, m[i+12], 11, -421815835);
	      c = HH(c, d, a, b, m[i+15], 16,  530742520);
	      b = HH(b, c, d, a, m[i+ 2], 23, -995338651);
	
	      a = II(a, b, c, d, m[i+ 0],  6, -198630844);
	      d = II(d, a, b, c, m[i+ 7], 10,  1126891415);
	      c = II(c, d, a, b, m[i+14], 15, -1416354905);
	      b = II(b, c, d, a, m[i+ 5], 21, -57434055);
	      a = II(a, b, c, d, m[i+12],  6,  1700485571);
	      d = II(d, a, b, c, m[i+ 3], 10, -1894986606);
	      c = II(c, d, a, b, m[i+10], 15, -1051523);
	      b = II(b, c, d, a, m[i+ 1], 21, -2054922799);
	      a = II(a, b, c, d, m[i+ 8],  6,  1873313359);
	      d = II(d, a, b, c, m[i+15], 10, -30611744);
	      c = II(c, d, a, b, m[i+ 6], 15, -1560198380);
	      b = II(b, c, d, a, m[i+13], 21,  1309151649);
	      a = II(a, b, c, d, m[i+ 4],  6, -145523070);
	      d = II(d, a, b, c, m[i+11], 10, -1120210379);
	      c = II(c, d, a, b, m[i+ 2], 15,  718787259);
	      b = II(b, c, d, a, m[i+ 9], 21, -343485551);
	
	      a = (a + aa) >>> 0;
	      b = (b + bb) >>> 0;
	      c = (c + cc) >>> 0;
	      d = (d + dd) >>> 0;
	    }
	
	    return crypt.endian([a, b, c, d]);
	  };
	
	  // Auxiliary functions
	  md5._ff  = function (a, b, c, d, x, s, t) {
	    var n = a + (b & c | ~b & d) + (x >>> 0) + t;
	    return ((n << s) | (n >>> (32 - s))) + b;
	  };
	  md5._gg  = function (a, b, c, d, x, s, t) {
	    var n = a + (b & d | c & ~d) + (x >>> 0) + t;
	    return ((n << s) | (n >>> (32 - s))) + b;
	  };
	  md5._hh  = function (a, b, c, d, x, s, t) {
	    var n = a + (b ^ c ^ d) + (x >>> 0) + t;
	    return ((n << s) | (n >>> (32 - s))) + b;
	  };
	  md5._ii  = function (a, b, c, d, x, s, t) {
	    var n = a + (c ^ (b | ~d)) + (x >>> 0) + t;
	    return ((n << s) | (n >>> (32 - s))) + b;
	  };
	
	  // Package private blocksize
	  md5._blocksize = 16;
	  md5._digestsize = 16;
	
	  module.exports = function (message, options) {
	    if(typeof message == 'undefined')
	      return;
	
	    var digestbytes = crypt.wordsToBytes(md5(message, options));
	    return options && options.asBytes ? digestbytes :
	        options && options.asString ? bin.bytesToString(digestbytes) :
	        crypt.bytesToHex(digestbytes);
	  };
	
	})();


/***/ },
/* 7 */
/***/ function(module, exports) {

	(function() {
	  var base64map
	      = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
	
	  crypt = {
	    // Bit-wise rotation left
	    rotl: function(n, b) {
	      return (n << b) | (n >>> (32 - b));
	    },
	
	    // Bit-wise rotation right
	    rotr: function(n, b) {
	      return (n << (32 - b)) | (n >>> b);
	    },
	
	    // Swap big-endian to little-endian and vice versa
	    endian: function(n) {
	      // If number given, swap endian
	      if (n.constructor == Number) {
	        return crypt.rotl(n, 8) & 0x00FF00FF | crypt.rotl(n, 24) & 0xFF00FF00;
	      }
	
	      // Else, assume array and swap all items
	      for (var i = 0; i < n.length; i++)
	        n[i] = crypt.endian(n[i]);
	      return n;
	    },
	
	    // Generate an array of any length of random bytes
	    randomBytes: function(n) {
	      for (var bytes = []; n > 0; n--)
	        bytes.push(Math.floor(Math.random() * 256));
	      return bytes;
	    },
	
	    // Convert a byte array to big-endian 32-bit words
	    bytesToWords: function(bytes) {
	      for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
	        words[b >>> 5] |= bytes[i] << (24 - b % 32);
	      return words;
	    },
	
	    // Convert big-endian 32-bit words to a byte array
	    wordsToBytes: function(words) {
	      for (var bytes = [], b = 0; b < words.length * 32; b += 8)
	        bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
	      return bytes;
	    },
	
	    // Convert a byte array to a hex string
	    bytesToHex: function(bytes) {
	      for (var hex = [], i = 0; i < bytes.length; i++) {
	        hex.push((bytes[i] >>> 4).toString(16));
	        hex.push((bytes[i] & 0xF).toString(16));
	      }
	      return hex.join('');
	    },
	
	    // Convert a hex string to a byte array
	    hexToBytes: function(hex) {
	      for (var bytes = [], c = 0; c < hex.length; c += 2)
	        bytes.push(parseInt(hex.substr(c, 2), 16));
	      return bytes;
	    },
	
	    // Convert a byte array to a base-64 string
	    bytesToBase64: function(bytes) {
	      for (var base64 = [], i = 0; i < bytes.length; i += 3) {
	        var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
	        for (var j = 0; j < 4; j++)
	          if (i * 8 + j * 6 <= bytes.length * 8)
	            base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
	          else
	            base64.push('=');
	      }
	      return base64.join('');
	    },
	
	    // Convert a base-64 string to a byte array
	    base64ToBytes: function(base64) {
	      // Remove non-base-64 characters
	      base64 = base64.replace(/[^A-Z0-9+\/]/ig, '');
	
	      for (var bytes = [], i = 0, imod4 = 0; i < base64.length;
	          imod4 = ++i % 4) {
	        if (imod4 == 0) continue;
	        bytes.push(((base64map.indexOf(base64.charAt(i - 1))
	            & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2))
	            | (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
	      }
	      return bytes;
	    }
	  };
	
	  module.exports = crypt;
	})();


/***/ },
/* 8 */
/***/ function(module, exports) {

	var charenc = {
	  // UTF-8 encoding
	  utf8: {
	    // Convert a string to a byte array
	    stringToBytes: function(str) {
	      return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
	    },
	
	    // Convert a byte array to a string
	    bytesToString: function(bytes) {
	      return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
	    }
	  },
	
	  // Binary encoding
	  bin: {
	    // Convert a string to a byte array
	    stringToBytes: function(str) {
	      for (var bytes = [], i = 0; i < str.length; i++)
	        bytes.push(str.charCodeAt(i) & 0xFF);
	      return bytes;
	    },
	
	    // Convert a byte array to a string
	    bytesToString: function(bytes) {
	      for (var str = [], i = 0; i < bytes.length; i++)
	        str.push(String.fromCharCode(bytes[i]));
	      return str.join('');
	    }
	  }
	};
	
	module.exports = charenc;


/***/ },
/* 9 */
/***/ function(module, exports) {

	/**
	 * Determine if an object is Buffer
	 *
	 * Author:   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
	 * License:  MIT
	 *
	 * `npm install is-buffer`
	 */
	
	module.exports = function (obj) {
	  return !!(obj != null &&
	    (obj._isBuffer || // For Safari 5-7 (missing Object.prototype.constructor)
	      (obj.constructor &&
	      typeof obj.constructor.isBuffer === 'function' &&
	      obj.constructor.isBuffer(obj))
	    ))
	}


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	/* Response.js */
	
	var EventEmitter = __webpack_require__(2),
	    util = __webpack_require__(5),
	    validator = __webpack_require__(3);
	
	var Response = function (_EventEmitter) {
	  _inherits(Response, _EventEmitter);
	
	  function Response(param) {
	    _classCallCheck(this, Response);
	
	    // if validation fails, throw error.
	
	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Response).call(this));
	
	    if (!_this._validate_param(param)) throw "Response: parameter for constructor is not valid";
	
	    _this.transaction_id = param.transaction_id;
	    _this.created_at = util.make_utc_timestamp();
	    _this.dst = param.dst;
	    _this.method = param.method;
	    _this.resource = param.resource;
	    _this.parameter = param.parameter;
	    _this.data = {
	      "status": "200",
	      "name": "response",
	      "method": param.method,
	      "resource": param.resource,
	      "transaction_id": param.transaction_id,
	      "response": ""
	    };
	    return _this;
	  }
	
	  _createClass(Response, [{
	    key: "status",
	    value: function status(status_code) {
	      if (typeof status_code !== "number") throw "status code should be number";
	      if (status_code < 100 || status_code > 999) throw "status code should be between 100 - 999";
	      this.data.status = status_code.toString();
	    }
	  }, {
	    key: "write",
	    value: function write(data) {
	      if (data === null || data === undefined) throw "data should be specified";
	      this.data.response = data;
	    }
	  }, {
	    key: "end",
	    value: function end() {
	      this.emit("send-ready");
	    }
	
	    // for internal
	
	  }, {
	    key: "_validate_param",
	    value: function _validate_param(param) {
	      if (!(param.transaction_id && validator.is_transaction_id(param.transaction_id))) return false;
	      if (!(!!param.method && typeof param.method === "string")) return false;
	      if (!param.method.match(/^(GET|POST|PUT|DELETE)$/)) return false;
	
	      if (!(!!param.dst && typeof param.dst === "string")) return false;
	      if (!(!!param.resource && typeof param.resource === "string" && param.resource.match(/^\/[0-9a-zA-Z-]+$/))) return false;
	
	      return true;
	    }
	  }]);
	
	  return Response;
	}(EventEmitter);
	
	module.exports = Response;

/***/ }
/******/ ]);
//# sourceMappingURL=peer_custom_mesg.js.map