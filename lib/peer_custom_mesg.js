"use strict";

class PeerCustomMesg extends EventEmitter {
  constructor(peer, custom_type) {
    super(); // when extends is used, super() should be called

    if(!this._validate_constructor(peer, custom_type)) throw new Error("wrong parameter for consructor");

    this.peer = peer; // skyway server connection instance
    this.custom_type = "X_" + custom_type.toUpperCase();

    // message handler for custom message
    this.peer.socket.on("message", (data) => {
      // suppress error when PING
      if(data.type && data.type === "PING") return;

      // check message format
      if(!this._validate_onmessage(data)) throw "received message has incorrect format";

      // suppress error when type = OFFER, ANSWER, CANDIDATE
      if(data.type === "OFFER" || data.type === "ANSWER" || data.type === "CANDIDATE") return;

      // check if type field is correct
      if(!this._has_valid_customtype(data.type)) throw "received message type does not match: " + data.type;

      // emit received message to web site js
      this.emit("message", {"srcPeerID": data.src, "data": data.payload});
    });
  }

  // send custom message
  send(dst, mesg) {
    if(!this._validate_send(dst, mesg)) throw "wrong parameters for send"

    this.peer.socket.send({
      "type": this.custom_type,
      "payload": mesg,
      "dst": dst
    });
  }

  /*
   * validation
   *
   **/
  _is_falsy(val) {
    if(val === null || val === false || val === undefined) return true;
    return false;
  }

  _validate_constructor(peer, custom_type) {
    if(this._is_falsy(peer)) return false;
    if(typeof(peer) !== 'object') return false;
    if(!(peer instanceof(Peer))) return false;

    if(this._is_falsy(custom_type)) return false;
    if(typeof(custom_type) !== 'string') return false;
    if(!custom_type.match(/^[A-Za-z]{8,16}$/)) return false;

    return true;
  }
  _validate_send(dst, mesg) {
      if(!dst) return false;
      if(typeof(dst) !== 'string') return false;
      if(this._is_falsy(mesg)) return false;

      return true;
  }
  _validate_onmessage(data) {
      if(this._is_falsy(data)) return false;
      if(typeof(data) !== "object") return false;
      if(this._is_falsy(data.type)) return false;
      if(typeof(data.type) !== 'string') return false;
      if(this._is_falsy(data.payload)) return false;
      if(this._is_falsy(data.dst)) return false;
      if(typeof(data.dst) !== 'string') return false;
      if(this._is_falsy(data.src)) return false;
      if(typeof(data.src) !== 'string') return false;

      return true;
  }

  _has_valid_customtype(received_type) {
      if(this._is_falsy(received_type)) return false;
      if(typeof(received_type) !== 'string') return false;
      if(received_type !== this.custom_type) return false;

      return true;
  }
}
