var jwt = require('jsonwebtoken');

// To Do: Move to config
var config = {
  secret: 'secret'
};

/*
jwt spec
header: {
  crypt: // encyption algortithm
},
secret: // Secret key string
claims: {
  host: //Implement later
  name: // username
  role: // User role
  expiry: // unix timestamp
}

payload = b64(header) + . + b64(claims);
sign = b64(crypt(payload, secret));
jwt = payload + '.' + signature;
*/

/*
**claims: {
    username: '',
    settings: ''
    exp: ''
**}
*/
var encrypt = function(claims) {
  var token = jwt.sign(claims, config.secret);
  return token;
};

var verify = function(token) {
  if (token == 'null' || !token) {
    return false;
  }
  // To Implement
  // => Decode
  // => Check if user role has access to API
  return jwt.verify(token, config.secret);
};

var decode = function(token) {
};

var getInTheWay = function(req, res, next) {
  var token = req.get('access-token');
  var verified = verify(token);
  if (verified) {
    next();
  } else {
    res.status(401)
      .send({
        success: 'false',
        message: 'Something wring with your session'
      });
  }
};

module.exports = {
  jwtEncode: encrypt,
  jwtVerify: verify,
  jwtDecode: decode,
  getInTheWay: getInTheWay
};
