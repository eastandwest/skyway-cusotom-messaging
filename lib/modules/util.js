var md5 = require('md5')

var util = {
  // it will be copied to request and response object library
  make_transaction_id: () => {
    return md5(util.make_utc_timestamp());
  },

  // return milisec order timestamp in UTC
  make_utc_timestamp: () => {
    return Date.now().toString();
  }
}

module.exports = util;
