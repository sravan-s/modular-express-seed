function _post(model, req, res) {
  let m = new model(req.body);
  // To Do: Change promise lib
  m.save((error) => {
    if (error) {
      res.send('error' + JSON.stringify(error));
    }
    res.send({
      'success': 'true'
    });
  });
}

function _put(model, req, res) {
  let q = {
    'id': req.params.id
  };
  let u = {
    'upsert': true
  };
  let m = new model(req.body);
  console.dir(req.body, q);
  m.findOneAndUpdate(q, req.body, u, (error) => {
    if (error) {
      res.send('error' + JSON.stringify(error));
    }
    res.send({
      'success': 'true'
    });
  });
}

function _get(model, req, res) {
  let m = new model(req.body);
  m.find((error, data) => {
    if (error) {
      res.send('error' + JSON.stringify(error));
    }
    res.send(data);
  });
}

function _delete(model, req, res) {
  let m = new model();
  m.remove({
    _id: req.body.id
  }, (error) => {
    if (error) {
      res.send('error', error);
    } else {
      res.send({
        'success': 'true'
      });
    }
  });
}

var crud = function(action, model, req, res) {
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
  }
};

module.exports = crud;
