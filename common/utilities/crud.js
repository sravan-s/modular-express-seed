var Promise = require('bluebird');

var parseError = require('./parse-error');

// Dividing into multiple functions of single responsibility
// Abstracting around here would just increase complexity
var _post = function(model, req, res) {
  var m = new model(req.body);
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
};

var _put = function(model, req, res) {
  var q = {
    '_id': req.params.id
  };
  var u = {
    'upsert': true
  };
  // var m = new model(req.body);
  model.findOneAndUpdate(q, req.body, u, function(error) {
    if (error) {
      res.status(500)
        .send(parseError(error));
    } else {
      res.send({
        'success': 'true'
      });
    }
  });
};

var _get = function(model, req, res) {
  var q = req.query;
  var query = {};
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
};

// !!Not case sensitive
var _search = function(model, req, res) {
  var query = req.query;
  // converts to regex and find
  if (query) {
    for (var key in query) {
      if (key !== '_id') {
        query[key] = new RegExp(query[key], 'i'); // 'i' makes this case insensitve
      } else {
        query[key] = query[key];
      }
    }
  }
  model.find(query, function(error, data) {
    if (error) {
      res.status(500)
        .send(parseError(error));
    } else {
      res.send(data);
    }
  });
}

// Uses mongoose-paginate plugin used in models
// req => /api/admins/paginate?pageSize=12&pageNumber=1
// res => {docs:[data1, data2 .... data12], total:100, limit: 1}
var _paginate = function(model, req, res) {
  // Sets default values
  var search = {};
  var sort = {};
  if (!req.query || !req.query.pageNumber) {
    req.query.pageNumber = 1;
  }
  if (!req.query || !req.query.pageSize) {
    req.query.pageSize = 10;
  }

  if (req.query.__filter && req.query.__filter.length) {
    var filters = JSON.parse(req.query.__filter);
    filters.forEach(function(filter) {
      // todo: cleanup this logic with a switch on filter.type
      if (filter.value != null && filter.label != 'sort' && filter.type != 'dateDynamic') { // regular text
        search[filter.label] = new RegExp('^' + filter.value, 'i');
      } else if (filter.label == 'sort') { // sorting
        sort = filter.value;
      } else if (filter.type == 'dateDynamic') { // date
        if (!filter.value.$gte) {
          delete filter.value.$gte;
        }
        if (!filter.value.$lte) {
          delete filter.value.$lte;
        }
        if (filter.value.$lte || filter.value.$gte) {
          search[filter.label] = filter.value;
        }
      }
    });
  }

  model.paginate(search, {
    limit: parseInt(req.query.pageSize),
    page: parseInt(req.query.pageNumber),
    sort: sort
  }).then(function(data, err) {
    // if error, return false
    if (!data) {
      console.log(err);
      res.status(500)
        .send(parseError(error));
    } else {
      res.send(data);
    }
  });
};

// merges 2 datum
var _merge = function(to, from, keys) {
  for (var key in keys) {
    if (!to[key]) {
      to[key] = from[key];
    }
  }
}

// For places where data need to be handled
var _getData = function(model, params) {
  return model.findOne(params).exec();
};

var _getOne = function(model, req, res) {
  model.findOne({
    _id: req.params.id
  }, function(error, data) {
    if (error) {
      res.status(500)
        .send(parseError(error));
    } else {
      res.send(data);
    }
  });
};

var _delete = function(model, req, res) {
  // var m = new model();
  model.remove({
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
};

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
    case 'getData':
      return _getData(model, req);
      break;
    case 'getOne':
      return _getOne(model, req, res);
      break;
    case 'paginate':
      return _paginate(model, req, res);
    case 'search':
      return _search(model, req, res);
  }
};

module.exports = crud;
