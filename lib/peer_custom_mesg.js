"use strict";

class PeerCustomMesg extends EventEmitter {
  constructor(peer, custom_type) {
    super(); // when extends is used, super() should be called

    if(!this._validate_constructor(peer, custom_type)) throw new Error("wrong parameter for consructor");

    this.peer = peer; // skyway server connection instance
    this.custom_type = "X_" + custom_type.toUpperCase();

    this.sender_callbacks = {};
    this.receiver_callbacks = {};

    // message handler for custom message
    this.peer.socket.on("message", (data) => {
      // suppress error when type is for signaling message
      if(data.type && this._is_signalling_mesg(data.type)) return;

      // check message format
      if(!this._validate_onmessage(data)) throw "received message has incorrect format";

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

  // it will be copied to request and response object library
  _make_transaction_id() {
    return md5(Date.now().toString());
  }

  /*
   * validation
   *
   **/
  _is_boolean(val) {
    return typeof(val) === "boolean";
  }

  _is_falsy(val) {
    if(val === null || val === false || val === undefined) return true;
    return false;
  }

  _is_transaction_id(candidate) {
    if(typeof(candidate) !== "string") return false;

    return !!candidate.match(/^[a-z0-9]{32}$/)
  }



  // check data.type is for signaling or not. In case of such a type is transmitted and
  // it is not taken into account with invalid message (since it does not match extensive type)
  // it show up annoying error in console. To prevent this, it is checked as signaling message
  // or not.
  _is_signalling_mesg(type) {
    if( typeof(type) === 'string' && type.match(/^(PING|OFFER|ANSWER|CANDIDATE)$/) ) {
      return true;
    } else {
      return false;
    }
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
