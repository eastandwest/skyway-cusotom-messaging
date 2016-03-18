/* An unit test code for lib/Response.js */
var expect = require('chai').expect
  , Response = require('../../lib/modules/Response')
  , sinon = require('sinon')

describe("Response", () => {
  describe("#constructor()", () => {
    it("should throw error when param.transaction_id is not valid", () => {
      expect( () => {new Response({"transaction_id": null, "method": "GET", "dst": "123", "resource" : "/test", "parameter" : {}}) } ).to.throw()
      expect( () => {new Response({"transaction_id": 123, "method": "GET", "dst": "123", "resource" : "/test", "parameter" : {}}) } ).to.throw()
      expect( () => {new Response({"transaction_id": "123456789012345678901234567890123", "method": "GET", "dst": "123", "resource" : "/test", "parameter" : {}}) } ).to.throw()
      expect( () => {new Response({"transaction_id": "1234567890123456789012345678901", "method": "GET", "dst": "123", "resource" : "/test", "parameter" : {}}) } ).to.throw()
    });
    it("should throw error when param.method is not valid", () => {
      expect( () => {new Response({"transaction_id": "12345678901234567890123456789012", "method": null, "dst": "123", "resource" : "/test", "parameter" : {}}) } ).to.throw()
      expect( () => {new Response({"transaction_id": "12345678901234567890123456789012", "method": 123, "dst": "123", "resource" : "/test", "parameter" : {}}) } ).to.throw()
      expect( () => {new Response({"transaction_id": "12345678901234567890123456789012", "method": "get", "dst": "123", "resource" : "/test", "parameter" : {}}) } ).to.throw()
    });
    it("should throw error when param.resource is not valid", () => {
      expect( () => {new Response({"transaction_id": "12345678901234567890123456789012", "method": "GET", "dst": "123", "resource" : null, "parameter" : {}}) } ).to.throw()
      expect( () => {new Response({"transaction_id": "12345678901234567890123456789012", "method": "GET", "dst": "123", "resource" : "hoge", "parameter" : {}}) } ).to.throw()
      expect( () => {new Response({"transaction_id": "12345678901234567890123456789012", "method": "GET", "dst": "123", "resource" : "/hoge__", "parameter" : {}}) } ).to.throw()
    });
    it("should throw error when param.dst is not valid", () => {
      expect( () => {new Response({"transaction_id": "12345678901234567890123456789012", "method": "GET", "dst": null, "resource" : "/test", "parameter" : {}}) } ).to.throw()
      expect( () => {new Response({"transaction_id": "12345678901234567890123456789012", "method": "GET", "dst": 123, "resource" : "/test", "parameter" : {}}) } ).to.throw()
    });
    it("should return Response instance when param is valid", () => {
      var res = new Response({"transaction_id": "12345678901234567890123456789012", "method": "GET", "dst": "123", "resource" : "/test", "parameter" : {}});
      expect(res).to.instanceof(Response);
      expect(res).to.have.property("transaction_id");
      expect(res).to.have.property("created_at");
      expect(res).to.have.property("method");
      expect(res).to.have.property("resource");
      expect(res).to.have.property("dst");
      expect(res).to.have.property("data");
      expect(res).to.have.property("parameter");


      expect(res.data).to.have.all.keys(["status", "method", "resource", "transaction_id", "response", "name"]);
    });
  });

  describe("#status(status_code)", () => {
    var res = new Response({"transaction_id": "12345678901234567890123456789012", "method": "GET", "dst": "123", "resource" : "/test", "parameter" : {}})
    it("should throw error when status_code is numeric, between 100 - 999", () => {
      expect( () => { res.status(null); }).to.throw();
      expect( () => { res.status(99); }).to.throw();
      expect( () => { res.status(1000); }).to.throw();
    });
    it("should change data.status property when status_code is valid", () => {
      res.status(100)
      expect( res.data.status ).to.equal("100");
    });
  });

  describe("#write(data)", () => {
    var res = new Response({"transaction_id": "12345678901234567890123456789012", "method": "GET", "dst": "123", "resource" : "/test", "parameter" : {}})
    it("should throw error when data is null or undefined", () => {
      expect( () => { res.write(null) } ).to.throw();
      expect( () => { res.write(undefined) } ).to.throw();
    });

    it("should change data.response property when data is valid", () => {
      res.write("hello");

      expect(res.data.response).to.equal("hello");
      res.write({"text": "hello"});
      expect(res.data.response).to.have.property("text", "hello");
    });
  });

  describe("#end()", () => {
    it("should emt 'send-ready' event", () => {
      var res = new Response({"transaction_id": "12345678901234567890123456789012", "method": "GET", "dst": "123", "resource" : "/test", "parameter" : {}})
      var spy = sinon.spy();

      res.on("send-ready", spy);
      res.write("test");
      res.end();

      sinon.assert.calledOnce(spy);
    });
  });
});
