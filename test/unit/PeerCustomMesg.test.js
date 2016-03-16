/* An unit test code for PeerCustomMesg.js */

var expect = require('chai').expect
  , EventEmitter = require('events')
  , PeerCustomMesg = require('../../lib/modules/PeerCustomMesg')
  , sinon = require('sinon');

class StubSocket extends EventEmitter {
  constructor() {
    super();
  }

  send() {
  }
}

class Stub {
  constructor() {
    this.socket = new StubSocket();
  }
}

var stub = new Stub();

describe('PeerCustomMesg', () => {
  /* constructor */
  describe('#constructor(peer, custom_type)', () => {
    it("should success if peer is valid object and custom_type is string", () => {
      var tmp = new PeerCustomMesg(stub, "CUSTOM");
      expect(tmp).to.be.an.instanceof(PeerCustomMesg);
    });
    it("this.custom_type should have prefix of 'X_'", () => {
      var tmp = new PeerCustomMesg(stub, "CUSTOM");
      expect(tmp.custom_type).to.be.equal("X_CUSTOM");

    });
    it("this.custom_type should be uppercase even if downcase is specified", () => {
      var tmp = new PeerCustomMesg(stub, "custom");
      expect(tmp.custom_type).to.be.equal("X_CUSTOM");
    });

    it("should raise error if parameter peer is null", () => {
      expect(function(){ new PeerCustomMesg(null, "CUSTOM")}).to.throw();
    });

    it("should raise error if parameter peer is string", () => {
      expect(function(){ new PeerCustomMesg("peer", "CUSTOM")}).to.throw();
    });

    it("should raise error if parameter custom_type is null", () => {
      expect(function(){ new PeerCustomMesg(stub, null)}).to.throw();
    });

    it("should raise error if parameter custom_type is number", () => {
      expect(function(){ new PeerCustomMesg(stub, 123)}).to.throw();
    });
  });

  /*
   * send : we will check error cases
   *
   */
  describe('#send(dst, mesg)', () => {
    var tmp = new PeerCustomMesg(stub, "CUSTOM");
    it("sould not raise error when parameter is valid", () => {
      expect(function(){tmp.send("123", "hello")}).to.not.throw();
      expect(function(){tmp.send("123", 0)}).to.not.throw();
    });

    it("sould raise error when parameter dst is null", () => {
      expect(function(){tmp.send(null, "hello")}).to.throw();
    });

    it("sould raise error when parameter dst is number", () => {
      expect(function(){tmp.send(123, "hello")}).to.throw();
    });

    it("sould raise error when parameter mesg is null", () => {
      expect(function(){tmp.send("123", null)}).to.throw();
    });
  })


  describe('#EventEmitter', () => {
    var stub = new Stub();

    it('should throw error when data is incorrect format', () => {
      var pcm = new PeerCustomMesg(stub, "CUSTOM");
      expect(function(){stub.socket.emit("message", {})}).to.throw();
      expect(function(){stub.socket.emit("message", {"type": "X_CUSTOM"})}).to.throw();
      expect(function(){stub.socket.emit("message", {"type": "X_CUSTOM", "payload": {}})}).to.throw();
      expect(function(){stub.socket.emit("message", {"type": "X_CUSTOM", "payload": {}, "dst": "123"})}).to.throw();
    });
    it('should emit signalling-mesg when data.type is PING', () => {
      var pcm = new PeerCustomMesg(stub, "CUSTOM");
      var spy = sinon.spy();

      pcm.on("signalling-mesg", spy);
      stub.socket.emit("message", {"type": "PING"});
      sinon.assert.calledOnce(spy);
      sinon.assert.calledWith(spy, "PING");
    });
    it('should emit signalling-mesg when data.type is OFFER', () => {
      var pcm = new PeerCustomMesg(stub, "CUSTOM");
      var spy = sinon.spy();

      pcm.on("signalling-mesg", spy);
      stub.socket.emit("message", {"type": "OFFER"});
      sinon.assert.calledOnce(spy);
      sinon.assert.calledWith(spy, "OFFER");
    });
    it('should emit signalling-mesg when data.type is CANDIDATE', () => {
      var pcm = new PeerCustomMesg(stub, "CUSTOM");
      var spy = sinon.spy();

      pcm.on("signalling-mesg", spy);
      stub.socket.emit("message", {"type": "CANDIDATE"});
      sinon.assert.calledOnce(spy);
      sinon.assert.calledWith(spy, "CANDIDATE");
    });

    it('should throw error when data.type is PONG', () => {
      var pcm = new PeerCustomMesg(stub, "CUSTOM");
      expect(function(){ stub.socket.emit("message", {"type": "PONG"})}).throw();
    });
    it('should throw error when data.type does not equal to X_CUSTOM', () => {
      var pcm = new PeerCustomMesg(stub, "CUSTOM");
      expect(function(){ stub.socket.emit("message", {"type": "X_HOGE", "payload": {}, "dst": "123", "src": "456"})}).throw();
    });
    it('should throw error when src equal dst', () => {
      var pcm = new PeerCustomMesg(stub, "CUSTOM");
      expect(function(){ stub.socket.emit("message", {"type": "X_HOGE", "payload": {}, "dst": "123", "src": "123"})}).throw();
    });
    it('should emit callback when data is valid', () => {
      var pcm = new PeerCustomMesg(stub, "CUSTOM");
      var spy = sinon.spy();

      pcm.on("message", spy);
      stub.socket.emit("message", {"type": "X_CUSTOM", "payload": "hello", "dst": "123", "src": "456"});

      sinon.assert.calledOnce(spy);
      sinon.assert.calledWith(spy, {"srcPeerID": "456", "data": "hello"});
    });
  });
});
