const parseError = require('./parse-error');

function _post(model, req, res) {
  let m = new model(req.body);
  // To Do: Change promise lib
  m.save(function(error) {
    if (error) {
      res.status(500)
        .send(parseError(error));
    } else {
      res.send({
        'success': 'true'
      });
    }
  });
}

function _put(model, req, res) {
  let q = {
    '_id': req.params.id
  };
  let u = {
    'upsert': true
  };
  let m = new model(req.body);
  m.findOneAndUpdate(q, req.body, u, function(error) {
    if (error) {
      res.status(500)
        .send(parseError(error));
    } else {
      res.send({
        'success': 'true'
      });
    }
  });
}

function _get(model, req, res) {
  let q = req.query;
  let query = {};
  // Constructs query with schema
  // To Do: Implement pagination logic [**!important**]
  model.schema.eachPath(function(path) {
    if (q[path]) {
      query[path] = q[path];
    }
  });
  model.find(query, function(error, data) {
    if (error) {
      res.status(500)
        .send(parseError(error));
    } else {
      res.send(data);
    }
  });
}

// Returns data
function _getData(model, params) {
  return model.findOne(params).exec();
}

function _delete(model, req, res) {
  let m = new model();
  m.remove({
    _id: req.params.id
  }, function(error) {
    if (error) {
      res.status(500)
        .send(parseError(error));
    } else {
      res.send({
        'success': 'true'
      });
    }
  });
}

const crud = function(action, model, req, res) {
  switch (action) {
  case 'get':
    _get(model, req, res);
    break;
  case 'put':
    _put(model, req, res);
    break;
  case 'post':
    _post(model, req, res);
    break;
  case 'delete':
    _delete(model, req, res);
    break;
  case 'getData':
    return _getData(model, req);
  }
};

module.exports = crud;
