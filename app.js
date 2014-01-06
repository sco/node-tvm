var express = require('express');
var atvm = require('./anonymous_tvm');
var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.use(express.logger('dev'));
  app.use(express.urlencoded());
  app.use(function(req, res, next) {
    res.contentType('application/json');
    next();
  });
});

app.post('/registrations', function(req, res, next) {
  atvm.register(req.body.device_id, req.body.key, function(err, data) {
    if (err) return next(err);
    res.send(200, JSON.stringify({'ok':'yeah'}));
  });
})

app.get('/tokens', function(req, res, next) {
  atvm.getToken(req.query.device_id, req.query.timestamp || 'TODO', req.query.signature || 'TODO', function(err, data) {
    if (err) return next(err);
    res.send(200, JSON.stringify(data));
  });
});

app.configure(function () {
  app.use(function(err, req, res, next){
    console.log(err.stack);
    res.send(err.status || 500, JSON.stringify({'error':err.message}))
  });
});

app.listen(app.get('port'));
console.log('Listening on port ' + app.get('port'));
