const parseError = function(req) {
  var parsed = {};
  parsed.orginal = req;
  return parsed;
};

module.exports = parseError;
