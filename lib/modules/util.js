import md5 from 'md5'

var util = {
  // it will be copied to request and response object library
  make_transaction_id: () => {
    return md5(Date.now().toString());
  }
}

module.exports = util;
