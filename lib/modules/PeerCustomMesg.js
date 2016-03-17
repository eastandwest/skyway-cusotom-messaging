import EventEmitter from 'events'
import validator from './validator'
import Request from './Request'
import Response from './Response'



class PeerCustomMesg extends EventEmitter {
  constructor(peer, custom_type) {
    super(); // when extends is used, super() should be called

    if(!validator.is_peer_object(peer)) throw "parameter peer does not valid object";
    if(!validator.is_string(custom_type)) throw "parameter custom_type should be string";

    this.peer = peer; // skyway server connection instance
    this.custom_type = "X_" + custom_type.toUpperCase();

    this.objRequests = {};


    // message handler for custom message
    this.peer.socket.on("message", (data) => {
      // check if type field is peerjs signaling type
      // for sinon test, this case emit 'signalling-mesg' event
      if(validator.is_signalling_type(data.type)) {
        this.emit("signalling-mesg", data.type);
        return;
      }

      // check if type field is correct
      if(data.type !== this.custom_type) throw "received type does not match with custom_type: " + data.type;

      // suppress error when type is for signaling message
      if(!validator.is_peerjs_format(data)) throw "data type is not valid peerjs format";

      // if request
      var req = data.payload;
      if(
        data.payload.name               &&
        data.payload.name === "request" &&
        data.payload.method             &&
        data.payload.resource           &&
        data.payload.parameter          &&
        data.payload.transaction_id
      ) {
        // operate it as request
        var req = data.payload;

        // create Response instance and set event handler when send-ready is called (res.end())
        //

        var param = {
          "transaction_id" : req.transaction_id,
          "dst": data.src,
          "method": req.method,
          "resource": req.resource,
          "parameter": req.parameter
        }
        var res = new Response(param)
          .once("send-ready", () => {
            this.send(res.dst, res.data);
          });

        // inject data.transaction_id & name
        var req_ = {
          "method": req.method,
          "resource": req.resource,
          "parameter": req.parameter
        }

        this.emit("request", req_, res);
      } else if (
          data.payload.name &&
          data.payload.name === "response" &&
          data.payload.status &&
          data.payload.method &&
          data.payload.resource &&
          data.payload.transaction_id &&
          data.payload.response
      ) {
        // operate it as response
        var res = data.payload;

        // throw if res.transaction_id does not exist in objRequests.
        if(!this.objRequests[res.transaction_id]) throw "transaction_id does not exist: " + res.transaction_id;

        // pickup request instance from objRequests ( do not forget to remoe from it)
        var req = this.objRequests[res.transaction_id];

        // throw if data.method does not match with requests.method.
        if(res.method !== req.method) throw "res.method does not match with req.method: " + res.method;

        // throw if data.resource does not match with requests.resource.
        if(res.resource !== req.resource) throw "res.resource does not match with req.resource: " + res.resource;

        // inject data.response.transaction_id & name
        var res_ = {
          "status": res.status,
          "method": res.method,
          "resource": res.resource,
          "response": res.response
        };

        // emit resolve function when status === 200 with data.response, otherwise reject
        if(res_.status === "200") {
          req.resolve(res_);
        } else {
          req.reject(res_.status + " : " + res_.response );
        }

        delete this.objRequests[res.transaction_id];
      } else {
         this.emit("message", {"srcPeerID": data.src, "data": data.payload});
      }
    });
  }

  // send custom message
  send(dst, mesg) {
    if(!validator.is_peerid(dst)) throw "parameter dst is not valid peer id"
    if(validator.is_falsy(mesg)) throw "parameter mesg is falsy"

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
  rpc(method, dst, resource, parameter) {
    // validation is done inside Request constructor (when fails, it throw error)
    var req = new Request({
      "method": method,
      "dst": dst,
      "resource": resource,
      "parameter": parameter,
      "resolve": null,
      "reject": null
    });

    var promise = new Promise( (resolve, reject) => {
      // set resolve & reject in side Request object
      req.resolve = resolve;
      req.reject = reject;

      var transaction_id = req.transaction_id;

      this.objRequests[transaction_id] = req;
      this.send(dst, req.data);
      this.emit("rpc-called", {"method": method, "resource": resource, "dst": dst});
    });

    return promise;
  }

  // shortcut to GET
  get(dst, resource, parameter) {
    return this.rpc("GET", dst, resource, parameter);
  }
}

module.exports = PeerCustomMesg;
