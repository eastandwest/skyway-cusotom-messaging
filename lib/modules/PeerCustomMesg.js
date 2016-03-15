import EventEmitter from 'events'
import validator from './validator'



class PeerCustomMesg extends EventEmitter {
  constructor(peer, custom_type) {
    super(); // when extends is used, super() should be called

    if(!validator.is_peer_object(peer)) throw "parameter peer does not valid object";
    if(!validator.is_string(custom_type)) throw "parameter custom_type should be string";

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
    if(!validator.is_peerid(dst)) throw "parameter dst is not valid peer id"
    if(validator.is_falsy(mesg)) throw "parameter dst is not valid peer id"

      console.log("send");

    this.peer.socket.send({
      "type": this.custom_type,
      "payload": mesg,
      "dst": dst
    });
  }
}

module.exports = PeerCustomMesg;
