/* An unit test code for lib/Request.js */
var expect = require('chai').expect
  , Request = require('../../lib/modules/Request');

describe("Request", () => {
  describe("#constructor()", () => {
    it("should throw error when param.method is null", () => {
      expect(function(){ new Request({"method": null, "dst": "123", "resource": "/test", "parameter": null, "resolve": () => {}, "reject" : () => {}}); }).to.throw();
    });
    it("should throw error when param.method is not string", () => {
      expect(function(){ new Request({"method": 123, "dst": "123", "resource": "/test", "parameter": null, "resolve": () => {}, "reject" : () => {}}); }).to.throw();
    });
    it("should throw error when param.method is not GET|POST|DELETE|PUT", () => {
      expect(function(){ new Request({"method": "TEST", "dst": "123", "resource": "/test", "parameter": null, "resolve": () => {}, "reject" : () => {}}); }).to.throw();
    });

    it("should throw error when param.dst is null", () => {
      expect(function(){ new Request({"method": "GET", "dst": null, "resource": "/test", "parameter": null, "resolve": () => {}, "reject" : () => {}}); }).to.throw();
    });
    it("should throw error when param.dst is not string", () => {
      expect(function(){ new Request({"method": "GET", "dst": 123, "resource": "/test", "parameter": null, "resolve": () => {}, "reject" : () => {}}); }).to.throw();
    });

    it("should throw error when param.resource is null", () => {
      expect(function(){ new Request({"method": "GET", "dst": "123", "resource": null, "parameter": null, "resolve": () => {}, "reject" : () => {}}); }).to.throw();
    });
    it("should throw error when param.resource is not string start with / and set of numeric, alphabet, hyphen", () => {
      expect(function(){ new Request({"method": "GET", "dst": "123", "resource": "test", "parameter": null, "resolve": () => {}, "reject" : () => {}}); }).to.throw();
      expect(function(){ new Request({"method": "GET", "dst": "123", "resource": "/test_", "parameter": null, "resolve": () => {}, "reject" : () => {}}); }).to.throw();
    });

    it("should throw error when param.resolve is neigther undefined or function", () => {
      expect(function(){ new Request({"method": "GET", "dst": "123", "resource": "/test", "parameter": null, "resolve": {}, "reject" : () => {}}); }).to.throw();
    });

    it("should throw error when param.reject is neigther undefined or function", () => {
      expect(function(){ new Request({"method": "GET", "dst": "123", "resource": "/test", "parameter": null, "resolve": () => {}, "reject" : {}}); }).to.throw();
    });

    it("should return Request instance when parameter is collect", () => {
      var req = new Request({"method": "GET", "dst": "123", "resource": "/test", "parameter": null, "resolve": () => {}, "reject" : () => {}});
      expect( req ).to.instanceof(Request);
      expect( req ).to.contain.all.keys(["dst", "created_at", "transaction_id", "resource", "method", "parameter", "resolve", "reject", "data"]);
      expect( req.data ).to.contain.all.keys(["name", "transaction_id", "resource", "method", "parameter"]);
    });
  });
});
