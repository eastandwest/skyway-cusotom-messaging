/* An unit test code for PeerCustomMesg.js */

var expect = require('chai').expect
  , EventEmitter = require('events')
  , PeerCustomMesg = require('../../lib/modules/PeerCustomMesg')
  , sinon = require('sinon')

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


describe('PeerCustomMesg', () => {
  /* constructor */
  describe('#constructor', () => {
    it("should success if peer is valid object and custom_type is string", () => {
      var stub = new Stub();
      var tmp = new PeerCustomMesg(stub, "CUSTOM");
      expect(tmp).to.be.an.instanceof(PeerCustomMesg);
    });
    it("this.custom_type should have prefix of 'X_'", () => {
      var stub = new Stub();
      var tmp = new PeerCustomMesg(stub, "CUSTOM");
      expect(tmp.custom_type).to.be.equal("X_CUSTOM");

    });
    it("this.custom_type should be uppercase even if downcase is specified", () => {
      var stub = new Stub();
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
  describe('#send', () => {
    var stub = new Stub();
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
    it('should throw error when data is incorrect format', () => {
      var stub = new Stub();
      var pcm = new PeerCustomMesg(stub, "CUSTOM");
      expect(function(){stub.socket.emit("message", {})}).to.throw();
      expect(function(){stub.socket.emit("message", {"type": "X_CUSTOM"})}).to.throw();
      expect(function(){stub.socket.emit("message", {"type": "X_CUSTOM", "payload": {}})}).to.throw();
      expect(function(){stub.socket.emit("message", {"type": "X_CUSTOM", "payload": {}, "dst": "123"})}).to.throw();
    });
    it('should emit signalling-mesg when data.type is PING', () => {
      var stub = new Stub();
      var pcm = new PeerCustomMesg(stub, "CUSTOM");
      var spy = sinon.spy();

      pcm.on("signalling-mesg", spy);
      stub.socket.emit("message", {"type": "PING"});
      sinon.assert.calledOnce(spy);
      sinon.assert.calledWith(spy, "PING");
    });
    it('should emit signalling-mesg when data.type is OFFER', () => {
      var stub = new Stub();
      var pcm = new PeerCustomMesg(stub, "CUSTOM");
      var spy = sinon.spy();

      pcm.on("signalling-mesg", spy);
      stub.socket.emit("message", {"type": "OFFER"});
      sinon.assert.calledOnce(spy);
      sinon.assert.calledWith(spy, "OFFER");
    });
    it('should emit signalling-mesg when data.type is CANDIDATE', () => {
      var stub = new Stub();
      var pcm = new PeerCustomMesg(stub, "CUSTOM");
      var spy = sinon.spy();

      pcm.on("signalling-mesg", spy);
      stub.socket.emit("message", {"type": "CANDIDATE"});
      sinon.assert.calledOnce(spy);
      sinon.assert.calledWith(spy, "CANDIDATE");
    });

    it('should throw error when data.type is PONG', () => {
      var stub = new Stub();
      var pcm = new PeerCustomMesg(stub, "CUSTOM");
      expect(function(){ stub.socket.emit("message", {"type": "PONG"})}).throw();
    });
    it('should throw error when data.type does not equal to X_CUSTOM', () => {
      var stub = new Stub();
      var pcm = new PeerCustomMesg(stub, "CUSTOM");
      expect(function(){ stub.socket.emit("message", {"type": "X_HOGE", "payload": {}, "dst": "123", "src": "456"})}).throw();
    });
    it('should throw error when src equal dst', () => {
      var stub = new Stub();
      var pcm = new PeerCustomMesg(stub, "CUSTOM");
      expect(function(){ stub.socket.emit("message", {"type": "X_HOGE", "payload": {}, "dst": "123", "src": "123"})}).throw();
    });
    it('should emit callback when data is valid', () => {
      var stub = new Stub();
      var pcm = new PeerCustomMesg(stub, "CUSTOM");
      var spy = sinon.spy();

      pcm.on("message", spy);
      stub.socket.emit("message", {"type": "X_CUSTOM", "payload": "hello", "dst": "123", "src": "456"});

      sinon.assert.calledOnce(spy);
      sinon.assert.calledWith(spy, {"srcPeerID": "456", "data": "hello"});
    });

    // when request message arrives
    it('should emit "request" event when data.name is "request" and other mandate properties are set', () => {
      var stub = new Stub();
      var pcm = new PeerCustomMesg(stub, "CUSTOM");
      var spy = sinon.spy();

      var success_data = {
        "type": "X_CUSTOM",
        "dst": "abc",
        "src": "def",
        "payload": {
          "name": "request",
          "method": "GET",
          "resource": "/test",
          "parameter": {},
          "transaction_id": "01234567890123456789012345678901"
        }
      };

      // for detecting "message" event has emitted
      pcm.on("request", spy);

      // for checking emitted arguments are valid
      pcm.on("request", (req, res) => {
        // check res has valid properties
        expect(req).to.have.property("method", "GET");
        expect(req).to.have.property("resource", "/test");
        expect(req.parameter).to.deep.equal({});
        // check name and transaction_id are properly injected
        expect(req).to.not.have.property("name");
        expect(req).to.not.have.property("transaction_id");

        // check res is object or not
        expect(res).to.be.an('object');
      });
      stub.socket.emit("message", success_data);
      sinon.assert.calledOnce(spy);

    });
    it('should emit "message" event when data.name is "request" but other mandate properties are lacked', () => {
      var stub = new Stub();
      var pcm = new PeerCustomMesg(stub, "CUSTOM"), spy = sinon.spy();
      var fail_data = {
        "type": "X_CUSTOM",
        "dst": "ABC",
        "src": "DEF",
        "payload": {
          "name": "request",
          "resource": "/test",
          "parameter": {},
          "transaction_id": "01234567890123456789012345678901"
        }
      }


      pcm.on("message", spy);
      stub.socket.emit("message", fail_data);
      sinon.assert.calledOnce(spy);
      sinon.assert.calledWith(spy, {"srcPeerID": "DEF", "data": fail_data.payload});
    });

  });

  describe("#rpc", () => {
    var stub = new Stub();
    var pcm = new PeerCustomMesg(stub, "CUSTOM");

    // validate method
    it("should throw error when method is not GET|POST|DELETE|PUT", () => {
      expect( () => { pcm.rpc(null, "123", "/resouce")} ).to.throw();
      expect( () => { pcm.rpc(123, "123", "/resouce")} ).to.throw();
      expect( () => { pcm.rpc("HOGE", "123", "/resouce")} ).to.throw();
    });

    // validate dst
    it("should throw error when dst is not string", () => {
      expect(function(){pcm.rpc("GET", null, "/resouce")}).to.throw();
      expect(function(){pcm.rpc("GET", 123, "/resouce")}).to.throw();
    });

    // validate resource
    it("should throw error when resource is not string start with /", () => {
      expect(function(){pcm.rpc("GET", "123", null)}).to.throw();
      expect(function(){pcm.rpc("GET", "123", 123)}).to.throw();
      expect(function(){pcm.rpc("GET", "123", "no-slash")}).to.throw();
    });

    // parameter is optional and any type is applied, so that no test code

    // success pattern
    it("should return Promise object when parameter is valid", () => {
      expect(pcm.rpc("GET", "123", "/resource").then(() => {}, () => {})).to.instanceof(Promise);
      expect(pcm.rpc("get", "123", "/resource")).to.instanceof(Promise);
      expect(pcm.rpc("POST", "123", "/resource")).to.instanceof(Promise);
      expect(pcm.rpc("post", "123", "/resource")).to.instanceof(Promise);
      expect(pcm.rpc("DELETE", "123", "/resource")).to.instanceof(Promise);
      expect(pcm.rpc("delete", "123", "/resource")).to.instanceof(Promise);
      expect(pcm.rpc("PUT", "123", "/resource")).to.instanceof(Promise);
      expect(pcm.rpc("PUT", "123", "/resource")).to.instanceof(Promise);
    });

    // test for the action of rpc's Promise
    describe("promise check", () => {
      var stub = new Stub();
      var pcm = new PeerCustomMesg(stub, "CUSTOM");
      var resolv = sinon.spy() , reject = sinon.spy();
      var data = {
        "type": "X_CUSTOM",
        "dst": "abc",
        "src": "123",
        "payload": {
          "name": "response",
          "status": "200",
          "method": "GET",
          "resource": "/test",
          "parameter": {},
          "transaction_id": null,
          "response": "ok"
        }
      };
      var setup = (success, error) => {
        var transaction_id;

        var promise = pcm.rpc("GET", "123", "/test").then(success, error);
        for(var key in pcm.objRequests) { transaction_id = key };

        return {"id": transaction_id, "promise": promise};
      }



      it("should return resolv function when status === 200", () => {
        var data_ = data;
        var transaction = setup((res) => {
          expect(res.status).to.equal("200");
          expect(res.method).to.equal("GET");
          expect(res.resource).to.equal("/test");
          expect(res.response).to.equal("ok");
        }, () => {});

        data_.payload.transaction_id = transaction.id;
        stub.socket.emit("message", data_);


        // check Request object has injected
        expect(pcm.objRequests[transaction.id]).to.be.an('undefined');
        return transaction.promise;
      });
      it("should return reject function when status !== 200", () => {
        var data_ = data;
        var transaction = setup((res) => {}, (status, res) => {
          expect(status).to.equal("500 : ng");
        });

        data_.payload.transaction_id = transaction.id;
        data_.payload.status = "500";
        data_.payload.response = "ng";
        stub.socket.emit("message", data_);

        return transaction.promise;
      });
      it("should raise error when unregistered transaction_id received", () => {
        var data_ = data;
        var transaction = setup(() => {}, () => {});

        data_.payload.transaction_id = "01234567890123456789012345678901";
        expect(() => {stub.socket.emit("message", data_);}).to.throw();
      });

      it("should raise error when req.payload.method does not match with request one", () => {
        var data_ = data;
        var transaction = setup(() => {}, () => {});

        data_.payload.transaction_id = transaction.id;
        data_.payload.method = "POST";
        expect(() => {stub.socket.emit("message", data_);}).to.throw();
      });
      it("should raise error when req.payload.resource does not match with request one", () => {
        var data_ = data;
        var transaction = setup(() => {}, () => {});

        data_.payload.transaction_id = transaction.id;
        data_.payload.resource = "/failpattern";
        expect(() => {stub.socket.emit("message", data_);}).to.throw();
      });
    });
  });

  describe("#get", () => {
    var stub = new Stub();
    var pcm = new PeerCustomMesg(stub, "CUSTOM");

    it("should call #rpc with GET", () => {
      var spy = sinon.spy();

      pcm.on("rpc-called", spy);
      pcm.get("123", "/test", {}).then((result) => {}).catch((reason) => {});

      sinon.assert.calledOnce(spy);
      sinon.assert.calledWith(spy, {"method": "GET", "resource": "/test", "dst": "123"});
    });
  });





});
