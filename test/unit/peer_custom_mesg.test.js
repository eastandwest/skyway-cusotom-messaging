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
