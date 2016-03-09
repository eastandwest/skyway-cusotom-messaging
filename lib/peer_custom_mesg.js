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

  // support req & resp context
  // WIPWIPWIP
  // WIPWIPWIP
  // WIPWIPWIP
  // WIPWIPWIP
  // WIPWIPWIP
  // WIPWIPWIP
  rpc_send(dst, mesg) {
    var promise = new Promise(resolve, reject);

    if(!this._validate_send(dst,mesg)) reject("wrong parameter for rpc_send");

    try{
      var payload = this._create_payload(mesg, true, true);
    } catch(err) {
      reject(err);
    }
  }

  rpc_set_receiver(funcReceiver) {
    this.rpc_receiver = funcReceiver;
  }

  // make payload for custom messaging
  //
  //   data : message data, not falthy (mandate)
  //   is_rpc : indicates this message is rpc or not, boolean (mandate)
  //   is_sender : indicates this message is sender or not, boolean (mandate if is_rpc is true)
  //   transaction_id : transaction id which is given from rpc sender request, 32bit-length string (mandate if is_rpc is true and is_sender is false)
  //
  //   e.g. (transaction id are ommitted)
  //   this._create_payload("hello", false) #=> {"data": "hello", "is_rpc": false}
  //   this._create_payload("hello", true, true) #=> {"data": "hello", "is_rpc": false, "from": "sender", "transaction_id": ... }
  //   this._create_payload("hello", true, false, ...) #=> {"data": "hello", "is_rpc": false, "from": "receiver", "transaction_id": ... }
  //
  _create_payload(data, is_rpc, is_sender, transaction_id) {
    // validation
    if(this._is_falsy(data)) throw "data should not be falthy";
    if(!this._is_boolean(is_rpc)) throw "is_rpc should be boolean";

    var _payload = {
      "data" : data,
      "is_rpc": is_rpc
    }

    // if it is rpc message, is_sender should be set as true or false
    // and transaction_id is set (when sender, new transaction_id will be used)
    if(is_rpc) {
      if(!this._is_boolean(is_sender)) throw "is_sender should be boolean";

      if(is_sender) {
        // transaction_id will be newly created and from will be 'sender'
        _payload.transaction_id = this._make_transaction_id();
        _payload.from = "sender";
      } else {
        // check given transaction_id is valid
        if(!this._is_transaction_id(transaction_id)) throw "transaction_id does not match with the format";

        _payload.transaction_id = transaction_id;
        _payload.from = "receiver"
      }
    }

    return _payload;
  }

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

  _set_sender_callback(transaction_id, callback) {
    return false;
  }

  _get_sender_callback(transaction_id) {
    return false;
  }

  _set_receiver_callback(transaction_id, callback) {
    return false;
  }

  _get_receiver_callback(transaction_id) {
    return false;
  }
}
}
