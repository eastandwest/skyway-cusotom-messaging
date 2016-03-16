var expect = require('chai').expect
  , util = require('../../lib/modules/util');


describe('unit', () => {
  describe('#make_transaction_id()', () => {
    it('should have 32 bit length ascii value (uncapitalized alphabet and number)', () => {
      expect(util.make_transaction_id()).to.match(/^[a-z0-9]{32}$/);
    });
  });

  describe("#make_utc_timestamp()", () => {
    it("should be set of numerical string", () => {
      expect(util.make_utc_timestamp()).to.match(/^[1-9][0-9]+$/);
    });
  });
});
