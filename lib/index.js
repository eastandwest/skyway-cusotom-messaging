var PeerCustomMesg = require('./modules/PeerCustomMesg');

if(typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = PeerCustomMesg;
} else {
  window.PeerCustomMesg = PeerCustomMesg;
}
