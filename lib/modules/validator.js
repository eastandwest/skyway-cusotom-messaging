var validator = {
  is_boolean: (val) => {
    return typeof(val) === "boolean";
  },

  is_falsy: (val) => {
    return !val;
  },

  is_transaction_id: (candidate) => {
    if(typeof(candidate) !== "string") return false;

    return !!candidate.match(/^[a-z0-9]{32}$/)
  },



  // check data.type is for signaling or not. In case of such a type is transmitted and
  // it is not taken into account with invalid message (since it does not match extensive type)
  // it show up annoying error in console. To prevent this, it is checked as signaling message
  // or not.
  is_signalling_type: (type) => {
    if( typeof(type) === 'string' && type.match(/^(PING|OFFER|ANSWER|CANDIDATE)$/) ) {
      return true;
    } else {
      return false;
    }
  },

  is_peer_object: (obj) => {
    return !!(obj && obj.toString && obj.toString() === "[object Object]")
  },

  // min and max is optional
  is_string: (str, min, max) => {
    if( typeof(str) !== "string") return false;

    var _min = (typeof(min) === "number"), _max = (typeof(max) === "number");

    if( ( _min || _max ) && !( _min && _max )) return false;

    if( typeof(min) === "number" || typeof(max) === "number") {
      if(min === max) return false;
      if(max < min ) return false;

      if(str.length < min || str.length > max) return false;
    }

    return true;
  },

  is_peerid: (id) => {
    if(typeof(id) !== 'string') return false;
    if(id.length === 0) return false;

    return true;
  },

  is_object: (obj) => {
    if(validator.is_falsy(obj)) return false;
    return (typeof(obj) === "object" ? true : false);
  },

  is_peerjs_format: (obj) => {
    if(typeof(obj.type) !== "string") return false;
    if(validator.is_falsy(obj.payload))return false;
    if(!validator.is_peerid(obj.dst)) return false;
    if(obj.dst && obj.src && !validator.is_peerid(obj.src)) return false;
    if(obj.dst === obj.src) return false;

    return true;
  }
}

module.exports = validator
