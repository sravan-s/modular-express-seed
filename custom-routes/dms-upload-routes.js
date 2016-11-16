var multer = require('multer');
var fs = require('fs');
var path = require('path');

// Function to get all files
function getFiles(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return {
      fileName: file
    };
  });
}

// Function to get all directories
function getFolders(srcpath) {
  return fs.readdirSync(srcpath).filter(function(file) {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

function DmsUploadFactory(route) {
  var _uploadUrl = 'uploads/dms/';

  route.get('/api/dmsfiles/:folderName', function(req, res) {
    try {
      req.params.folderName = req.params.folderName || '';
      var directories = getFiles('uploads/dms/' + req.params.folderName);
      res.send(directories);
    } catch (e) {
      res.status(400).send(e);
    }
  });
  // mutler cannot save files in orginal filename
  route.post(
    '/api/dmsfiles/',
    multer({ dest: _uploadUrl }).single('uploads'),
    function(req, res) {
      var _orginalName = req.file.originalname;
      var _newName = req.file.filename;
      var _folderName = req.body.folderName || 'default';
      console.log(_uploadUrl + _newName, _uploadUrl + _folderName + _orginalName);
      fs.rename(_uploadUrl + _newName, _uploadUrl + _folderName + _orginalName, function(err) {
        if(err) {
          console.log(err);
          res.status(500).send(err);
        } else {
          res.status(201).send({
            succes: true
          });
        }
      });
    });

  route.delete('/api/dmsfiles/:folderName/:fileName', function(req, res) {
    // should implement res in callback, right now, callback takes hellawalot
    // time to execute
    try {
      fs.unlinkSync(_uploadUrl + req.params.folderName + '/' + req.params.fileName);
      res.status(200).send({
        succes: true
      });
    } catch (e) {
      res.status(410).send(e);
    }
  });

  // For managing folders
  route.get('/api/dmsFolders', function(req, res) {
    res.send(getFolders(_uploadUrl));
  });
  route.post('/api/dmsFolders', function(req, res) {
    try {
      fs.mkdirSync(_uploadUrl + req.body.newFolderName);
      res.status(201).send({
        success: true
      });
    } catch(e) {
      res.status(409).send(e);
    }
  });
  route.delete('/api/dmsFolders/:folderName', function(req, res) {
    try {
      fs.rmdirSync(_uploadUrl + req.params.folderName);
      res.status(201).send({
        success: true
      });
    } catch(e) {
      res.status(409).send(e);
    }
  });
}

module.exports = DmsUploadFactory;
