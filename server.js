var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var favicon = require('favicon');
var log = require('./libs/log')(module)
var config          = require('./libs/config');

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use(express.static(path.join(__dirname)));
app.get('/api', function (req, res) {
    res.send('API is running');
});

app.use(function(req, res, next){
    res.status(404);
    log.debug('Not found URL: %s',req.url);
    res.send({ error: 'Not found' });
    return;
});

app.use(function(err, req, res, next){
    res.status(err.status || 500);
    log.error('Internal error(%d): %s',res.statusCode,err.message);
    res.send({ error: err.message });
    return;
});

app.get('/ErrorExample', function(req, res, next){
    next(new Error('Random error!'));
});
	
app.listen(config.get('port'), function(){
    log.info('Express server listening on port ' + config.get('port'));
});


