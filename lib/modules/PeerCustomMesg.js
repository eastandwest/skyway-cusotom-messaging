import EventEmitter from 'events'
import validator from './validator'



class PeerCustomMesg extends EventEmitter {
  constructor(peer, custom_type) {
    super(); // when extends is used, super() should be called

    if(!validator.is_peer_object(peer)) throw "parameter peer does not valid object";
    if(!validator.is_string(custom_type)) throw "parameter custom_type should be string";

    this.peer = peer; // skyway server connection instance
    this.custom_type = "X_" + custom_type.toUpperCase();

    this.objRequests = {};
    this.objResponses = {};


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

      // if data.transaction_id is registered in objRequests, rpc promise will be resolved
      if(data.transaction_id && !!objRequest[data.transaction_id] && data.status === "200") {
        // case request from peer
        //
        //  var req = data, res = new Response(res);
        //  this.objResponse[res.transaction_id] = res;
        //
        // this.emit("request", req, res);
        //
        //
        // case respone from peer
        //
        // status === 200
        //  req.resolve(resp.data);
        // status !== 200
        //  req.reject(resp.data);
        //
      // otherwise,
      // emit received message to web site js
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
    // todo: validation ...

    var promise = new Promise(function(resolve, reject) {
      var req = new Request(method, dst, resource, parameter, resolve, reject);
      var transaction_id = req.transaction_id;

      this.objRequests[transaction_id] = req;
      this.send(dst, req.data);
    });

    return promise;
  }

  // below methods refer this.rpc
  get(dst, resource, parameter) {
    this.rpc("GET", dst, resource, parameter);
  }

  stop(dst, resource, parameter) {
    this.rpc("STOP", dst, resource, parameter);
  }


}

module.exports = PeerCustomMesg;
