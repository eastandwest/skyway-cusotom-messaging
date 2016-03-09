/* unit test for peer_custom_mesg.js */

// global setting for unit test (unit test requires to connect to skyway server)
//
// todo : work with OSS peer server
var peer = new Peer("test_kdfdsafdkajeqj5412", {'key': 'dbe1b9ed-5a52-4488-a592-c451daf74206'});

describe('#constructor()', function(){
  it('should run properly, when parameter valid', function(){
    var custom = new PeerCustomMesg(peer, "UNITTEST");
    custom.should.be.a('object');
    custom.should.be.instanceof(PeerCustomMesg);
  });

  it('should this.type will be uppercase when downcase type has set', function(){
    var custom = new PeerCustomMesg(peer, "unittest");
    custom.custom_type.should.equal("X_UNITTEST")
  });

  it('should throw error, when parameter peer is null', function(){
    (function(){new PeerCustomMesg(null, "unittest")}).should.throw(Error);
  });

  it('should raise error, when parameter peer is not object', function(){
    (function(){new PeerCustomMesg(0, "unittest")}).should.throw(Error);
  });

  it('should raise error, when parameter peer is object but instance of Peer', function(){
    (function(){new PeerCustomMesg({}, "unittest")}).should.throw(Error);
  });

  it('should raise error, when parameter custom_type is null', function(){
    (function(){new PeerCustomMesg(peer, null)}).should.throw(Error);
  });

  it('should raise error, when parameter custom_type is not string', function(){
    (function(){new PeerCustomMesg(peer, 0)}).should.throw(Error);
  });

  it('should raise error, when parameter custom_type is string but format is wrong (valid format is 8 - 16 length alphabet', function(){
    (new PeerCustomMesg(peer, "ABCDEFGH")).should.be.instanceof(PeerCustomMesg);
    (function(){new PeerCustomMesg(peer, "ABCDEFG")}).should.throw(Error);
    (function(){new PeerCustomMesg(peer, "ABCDEFG0")}).should.throw(Error);
    (new PeerCustomMesg(peer, "ABCDEFGHABCDEFGH")).should.be.instanceof(PeerCustomMesg);
    (function(){new PeerCustomMesg(peer, "ABCDEFGHABCDEFGHI")}).should.be.throw(Error);
  });
});

describe('#_signalling_mesg()', function(){
  var custom = new PeerCustomMesg(peer, "UNITTEST");

  it('should return true if type is PING', () => {
    expect(custom._is_signalling_mesg("PING")).to.be.true;
  });

  it('should return true if type is OFFER', () => {
    expect(custom._is_signalling_mesg("OFFER")).to.be.true;
  });

  it('should return true if type is ANSWER', () => {
    expect(custom._is_signalling_mesg("ANSWER")).to.be.true;
  });

  it('should return true if type is CANDIDATE', () => {
    expect(custom._is_signalling_mesg("CANDIDATE")).to.be.true;
  });

  it('should return false if type is PONG, since it is not happen in the SkyWay specification.', () => {
    expect(custom._is_signalling_mesg("PONG")).to.be.false;
  });

  it('should return false if type is not for signalling message', () => {
    expect(custom._is_signalling_mesg("CUSTOM")).to.be.false;
    expect(custom._is_signalling_mesg("PING_")).to.be.false;
    expect(custom._is_signalling_mesg("_PING")).to.be.false;
  });
});

describe('#_create_payload()', function(){
  var custom = new PeerCustomMesg(peer, "UNITTEST");

  it('should return valid object, when parameter is valid', function(){
    expect(custom._create_payload("hello", false)).to.deep.equal({
      "data": "hello",
      "is_rpc": false
    });

    var res = custom._create_payload("hello", true, true)
    expect(res).to.have.deep.property("data", "hello")
    expect(res).to.have.deep.property("is_rpc", true)
    expect(res).to.have.deep.property("from", "sender")
    expect(res.transaction_id).to.match(/^[0-9a-z]{32}$/)

    var res = custom._create_payload("hello", true, false, "01234567890123456789012345678901")
    expect(res).to.have.deep.property("data", "hello")
    expect(res).to.have.deep.property("is_rpc", true)
    expect(res).to.have.deep.property("from", "receiver")
    expect(res.transaction_id).to.equal("01234567890123456789012345678901")
  });

  it('should throw error, when data is not valid', function(){
    expect(function(){custom._create_payload(null, false)}).to.throw("data should not be falthy");

    expect(function(){custom._create_payload("hello", 0)}).to.throw("is_rpc should be boolean");

    expect(function(){custom._create_payload("hello", true, 0)}).to.throw("is_sender should be boolean");

    expect(function(){custom._create_payload("hello", true, false, null)}).to.throw("transaction_id does not match with the format");
    expect(function(){custom._create_payload("hello", true, false, "0123456789012345678901234567890")}).to.throw("transaction_id does not match with the format");
    expect(function(){custom._create_payload("hello", true, false, "012345678901234567890123456789012")}).to.throw("transaction_id does not match with the format");
  });
});

describe("#_make_transaction_id()", function(){
  var custom = new PeerCustomMesg(peer, "UNITTEST");

  it("should make valid format of transaction id", function(){
    expect(custom._make_transaction_id()).to.match(/^[0-9a-z]{32}$/);
  });
});

describe("#_is_boolean()", function(){
  var custom = new PeerCustomMesg(peer, "UNITTEST");

  it("should be true if val is boolan", function(){
    expect(custom._is_boolean(true)).to.be.true;
    expect(custom._is_boolean(false)).to.be.true;
  });

  it("should be false if val is not boolan", function(){
    expect(custom._is_boolean(null)).to.be.false;
    expect(custom._is_boolean(1)).to.be.false;
    expect(custom._is_boolean("hoge")).to.be.false;
    expect(custom._is_boolean({})).to.be.false;
  });
});

describe("#_is_transaction_id()", function(){
  var custom = new PeerCustomMesg(peer, "UNITTEST");

  it("should be true if transaction_id is 32 bytes long and contains number and downcase alphabet only", function(){
    expect(custom._is_transaction_id("0123456789abcdefghij0123456789kl")).to.be.true;
    expect(custom._is_transaction_id("0123456789mnopqrstuv01234567wxyz")).to.be.true;
  });
  it("should be false if transaction_id is not string", function(){
    expect(custom._is_transaction_id(null)).to.be.false;
    expect(custom._is_transaction_id(123)).to.be.false;
  });
  it("should be false if transaction_id is string but not 32 bytes long or contains uppercase alphabet or non-ascii type string", function(){
    expect(custom._is_transaction_id("1234567890123456789012345678901")).to.be.false;
    expect(custom._is_transaction_id("123456789012345678901234567890123")).to.be.false;
    expect(custom._is_transaction_id("123456789A1234567890123456789012")).to.be.false;
    expect(custom._is_transaction_id("123456789あ1234567890123456789012")).to.be.false;
  });
});


describe('#_validate_send()', function(){
  var custom = new PeerCustomMesg(peer, "UNITTEST");

  it('should return true, when parameter valid', function(){
    expect(custom._validate_send("dst", "hello")).to.be.true;
  });

  it('should return false, when parameter dst is null', function(){
    expect(custom._validate_send(null, "hello")).to.be.false;
  });

  it('should return false, when parameter dst is not string', function(){
    expect(custom._validate_send(0, "hello")).to.be.false;
  });

  it('should return false, when parameter mesg is null', function(){
    expect(custom._validate_send("dst", null)).to.be.false;
  });
});

describe('#_validate_onmessage()', function(){
  var custom = new PeerCustomMesg(peer, "UNITTEST");

  it('should return true, when parameter valid', function(){
    expect(custom._validate_onmessage({"type": "UNITTEST", "payload": "hello", "dst": "dst", "src": "src"})).to.be.true;
  });

  it('should return false, when parameter data is null', function(){
    expect(custom._validate_onmessage("dst", null)).to.be.false;
  });

  it('should return false, when parameter data is not object', function(){
    expect(custom._validate_onmessage("dst", "fail pattern")).to.be.false;
  });

  it('should return false, when parameter data is object but does not contain proper properties', function(){
    expect(custom._validate_onmessage("dst", {"type": "UNITTEST", "data": "hello", "dst": "dst", "src": "src"})).to.be.false;
    expect(custom._validate_onmessage("dst", {"type": "UNITTEST", "payload": "hello", "dstination": "dst", "src": "src"})).to.be.false;
    expect(custom._validate_onmessage("dst", {"type": "UNITTEST", "payload": "hello", "dst": "dst", "source": "src"})).to.be.false;
  });

  it('should return false, when the value of properties are incorrect', function(){
    expect(custom._validate_onmessage("dst", {"type": "UNITTEST", "payload": null, "dst": "dst", "src": "src"})).to.be.false;
    expect(custom._validate_onmessage("dst", {"type": "UNITTEST", "payload": "hello", "dst": null, "src": "src"})).to.be.false;
    expect(custom._validate_onmessage("dst", {"type": "UNITTEST", "data": "hello", "dst": 0, "src": "src"})).to.be.false;
    expect(custom._validate_onmessage("dst", {"type": "UNITTEST", "data": "hello", "dst": "dst", "src": null})).to.be.false;
    expect(custom._validate_onmessage("dst", {"type": "UNITTEST", "data": "hello", "dst": "dst", "src": 0})).to.be.false;
  });
});

describe('#_validate_customtype()', function(){
  var custom = new PeerCustomMesg(peer, "UNITTEST");

  it('should return true, when received_type is as same as this.custom_type', function(){
    expect(custom._has_valid_customtype("X_UNITTEST")).to.be.true;
  });

  it('should return false, when received_type is null', function(){
    expect(custom._has_valid_customtype(null)).to.be.false;
  });

  it('should return false, when received_type is not string', function(){
    expect(custom._has_valid_customtype(0)).to.be.false;
  });

  it('should return false, when received_type does not match this.custom_type', function(){
    expect(custom._has_valid_customtype("X_FAILTEST")).to.be.false;
  });
});
