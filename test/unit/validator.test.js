var expect = require('chai').expect
  , validator = require('../../lib/modules/validator');


describe('validator', () => {
  describe('#is_boolean(val)', () => {
    it('should return true if parameter is boolean', () => {
      expect(validator.is_boolean(true)).to.true;
      expect(validator.is_boolean(false)).to.true;
    });
    it('should return false if parameter is not boolean', () => {
      expect(validator.is_boolean(null)).to.false;
      expect(validator.is_boolean(1)).to.false;
    });
  });

  describe('#is_falsy(val)', () => {
    it('should return true if parameter is falthy', () => {
      expect(validator.is_falsy(false)).to.true;
      expect(validator.is_falsy(null)).to.true;
      expect(validator.is_falsy(0)).to.true;
      expect(validator.is_falsy(undefined)).to.true;
    });
    it('should return false if parameter is not falthy', () => {
      expect(validator.is_falsy(1)).to.false;
      expect(validator.is_falsy({})).to.false;
      expect(validator.is_falsy("hoge")).to.false;
    });
  });

  describe('#is_transaction_id(candidate)', () => {
    it('should return true if parameter is 32 length of alphabet and number', () => {
      expect(validator.is_transaction_id("0123456789abcdefghij0123456789ab")).to.true;
    });
    it('should return false if parameter is not 32 length of alphabet and number', () => {
      expect(validator.is_transaction_id("0123456789abcdefghij0123456789")).to.false;
      expect(validator.is_transaction_id("0123456789ABcdefghij0123456789ab")).to.false;
      expect(validator.is_transaction_id("0123456789あBcdefghij0123456789ab")).to.false;
      expect(validator.is_transaction_id(null)).to.false;
      expect(validator.is_transaction_id(0)).to.false;
      expect(validator.is_transaction_id({})).to.false;
    });
  });

  describe('#is_signalling_type(type)', () => {
    it('should return true if type is PING|OFFER|ANSWER|CANDIDATE', () => {
      expect(validator.is_signalling_type("PING")).to.true;
      expect(validator.is_signalling_type("OFFER")).to.true;
      expect(validator.is_signalling_type("ANSWER")).to.true;
      expect(validator.is_signalling_type("CANDIDATE")).to.true;
    });
    it('should return false if type is not PING|OFFER|ANSWER|CANDIDATE', () => {
      expect(validator.is_signalling_type("PONG")).to.false;
      expect(validator.is_signalling_type("HOGE")).to.false;
      expect(validator.is_signalling_type(null)).to.false;
      expect(validator.is_signalling_type({})).to.false;
    });
  });

  describe('#is_peer_object(obj)', () => {
    class Peer {
      constructor(){}
    };
    it('should return true if obj is Peer object', () => {
      var peerObj = new Peer();
      expect(validator.is_peer_object(peerObj)).to.true;
    });
    it('should return false if obj is not Peer object', () => {
      // todo: generic Object {} should return false
      expect(validator.is_peer_object(null)).to.false;
      expect(validator.is_peer_object("")).to.false;
    });
  });

  describe('#is_string(str, min, max)', () => {
    it('should return true if str is string and both min and max is null', () => {
      expect(validator.is_string("abc")).to.true;
      expect(validator.is_string("")).to.true;
      expect(validator.is_string("あいう")).to.true;
    });
    it('should return true if str is string and both min and max is set (min < max)', () => {
      expect(validator.is_string("a", 1, 5)).to.true;
      expect(validator.is_string("abcde", 1, 5)).to.true;
    });
    it('should return false if str is not string', () => {
      expect(validator.is_string(null)).to.false;
      expect(validator.is_string({})).to.false;
    });
    it('should return false if str is string but either min or max is not number', () => {
      expect(validator.is_string("abc", null, 1)).to.false;
      expect(validator.is_string("abc", 0, null)).to.false;
    });
    it('should return false if str is string but max < min', () => {
      expect(validator.is_string("abc", 5, 1)).to.false;
    });
    it('should return false if str is string but lenght does not match min and max', () => {
      expect(validator.is_string("abcdef", 2, 5)).to.false;
      expect(validator.is_string("a", 2, 5)).to.false;
    });
  });

  describe('#is_peerid(id)', () => {
    it('should return true if id is string', () => {
      expect(validator.is_peerid("abc")).to.true;
    });
    it('should return false if id is string but blank', () => {
      expect(validator.is_peerid("")).to.false;
    });
    it('should return false if id is not string', () => {
      expect(validator.is_peerid({})).to.false;
      expect(validator.is_peerid(123)).to.false;
    });
  });

  describe('#is_object(obj)', () => {
    it('should return true if obj is object', () => {
      expect(validator.is_object({})).to.true;
    });
    it('should return false if obj is not object', () => {
      expect(validator.is_object(null)).to.false;
      expect(validator.is_object(12)).to.false;
      expect(validator.is_object("hoge")).to.false;
    });
  });

  describe('#is_peerjs_format(obj)', () => {
    it('should return true if obj is proper peerjs format', () => {
      expect(validator.is_peerjs_format({
        type: "OFFER", payload: {}, dst: "123"
      })).to.true;
      expect(validator.is_peerjs_format({
        type: "OFFER", payload: "hello", dst: "123"
      })).to.true;
      expect(validator.is_peerjs_format({
        type: "OFFER", payload: {}, dst: "123", src: "345",
      })).to.true;
    });
    it('should return false if obj is not proper peerjs format', () => {
      expect(validator.is_peerjs_format({
        type: "OFFER", payload: {}, src: "123"
      })).to.false;
      expect(validator.is_peerjs_format({
        type: "OFFER", payload: {}, dst: 123
      })).to.false;
      expect(validator.is_peerjs_format({
        type: "OFFER", payload: null, dst: "123"
      })).to.false;
      expect(validator.is_peerjs_format({
        type: "OFFER", payload: null, dst: "123", src: 123
      })).to.false;
      expect(validator.is_peerjs_format({
        type: null, payload: "hello", dst: "123"
      })).to.false;
      expect(validator.is_peerjs_format({
        type: "OFFER", payload: "hello", src: "123", dst: "123"
      })).to.false;
    });
  });
});
