"use strict";

class PeerCustomMesg extends EventEmitter {
  constructor(peer, custom_type) {
    super(); // when extends is used, super() should be called
    
    this.peer = peer; // skyway server connection instance
    this.custom_type = "X_" + custom_type; // todo capitalize

    this.peer.socket.on("message", (data) => {
      if(data.type === this.custom_type) {
        this.emit("message", {"srcPeerID": data.src, "data": data.payload});
      }
    });
  }
  
  send(dst, mesg) {
    this.peer.socket.send({
      "type": this.custom_type,
      "payload": this.createPayload(mesg),
      "dst": dst
    });
  }
  
  createPayload(mesg){
      return mesg;
  }
}