var express = require('express');
var rest = require('restler');

var app = express();

var owm = {
  url : 'http://api.openweathermap.org/data/2.5/weather'
};

app.get('/coord/:lat/:long/:format', function (req, resp) {
  rest.get(owm.url + '?lat=' + req.params.lat + '&lon=' + req.params.long + '&lang=fr&mode=' + req.params.format).on('complete', function (response) {
    resp.send(response);
  });
});

app.get('/place/:place/:format', function (req, resp) {
  rest.get(owm.url + '?q=' + req.params.place + '&lang=fr&mode=' + req.params.format).on('complete', function (response) {
    resp.send(response);
  });
});

app.get('/weather/:lat/:long', function (req, resp) {
  rest.get(owm.url + '?lat=' + req.params.lat + '&lon=' + req.params.long  + '&lang=fr&mode=json').on('complete', function (response) {
    var weather = {
      icon: 'http://openweathermap.org/img/w/' + response.weather[0].icon + '.png',
      data: response.weather
    };
    resp.send(weather);
  });
});

var port = process.env.PORT || 9000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

