var expect = require('chai').expect
  , util = require('../../lib/modules/util');


describe('unit', () => {
  describe('#make_transaction_id()', () => {
    it('should have 32 bit length ascii value (uncapitalized alphabet and number)', () => {
      expect(util.make_transaction_id()).to.match(/^[a-z0-9]{32}$/);
    });
  });
});
