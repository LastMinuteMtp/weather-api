var express = require('express');
var rest = require('restler');

var app = express();

var owm = {
  url: 'http://api.openweathermap.org/data/2.5/weather',
  lang: '&lang=fr'
};

owm.get = function (parameters, callback) {
  rest.get(owm.url + '?' + parameters + owm.lang).on('complete', callback);
};

app.get('/', function (req, resp) {
  owm.get('q=Montpellier&lang=fr&mode=html', function (response) { resp.send(response); });
});

app.get('/weather/:lat/:long/raw.:format', function (req, resp) {
  owm.get('lat=' + req.params.lat + '&lon=' + req.params.long + '&mode=' + req.params.format, function (response) { resp.send(response); });
});

app.get('/weather/:place/raw.:format', function (req, resp) {
  owm.get('q=' + req.params.place + '&mode=' + req.params.format, function (response) { resp.send(response); });
});

owm.process = function (raw) {
  var ready = raw;
  return ready;
};

app.get('/weather/:lat/:long/ready.:format', function (req, resp) {
  owm.get('lat=' + req.params.lat + '&lon=' + req.params.long + '&mode=' + req.params.format, function (response) {
    resp.send(owm.process(response));
  });
});

app.get('/weather/:place/ready.:format', function (req, resp) {
  owm.get('q=' + req.params.place + '&mode=' + req.params.format, function (response) {
    resp.send(owm.process(response));
  });
});

var port = process.env.PORT || 9000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

