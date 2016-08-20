var express = require('express');
var app = express();
var path = require('path');

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname+'/index.html'));
});


app.get('/tile/:z/:x/:y', function(req, res) {
  console.log(req.params);
  res.sendFile(path.join(__dirname + '/tiles/' + req.params.z + '/' + req.params.x + '-' + req.params.y + '.jpg'));
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
