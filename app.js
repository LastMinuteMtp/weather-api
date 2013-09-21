var express = require('express');
var rest = require('restler');
var condition = require('./model/condition');

var app = express();

var owm = {
  url: 'http://api.openweathermap.org/data/2.5/weather',
  lang: '&lang=fr',
  units: '&units=metric'
};

var critera = {
  night: 'n',
  tooCold : 10,
  tooHot: 30,
  tooWindy: 50
};

owm.get = function (parameters, callback) {
  rest.get(owm.url + '?' + parameters + owm.lang + owm.units, {parser: rest.parsers.json}).on('complete', callback);
};

app.get('/', function (req, resp) {
  owm.get('q=Montpellier&lang=fr&mode=html', function (raw) { resp.send(raw); });
});

app.get('/weather/:lat/:long/raw.:format', function (req, resp) {
  owm.get('lat=' + req.params.lat + '&lon=' + req.params.long + '&mode=' + req.params.format, function (raw) { resp.send(raw); });
});

app.get('/weather/:place/raw.:format', function (req, resp) {
  owm.get('q=' + req.params.place + '&mode=' + req.params.format, function (raw) { resp.send(raw); });
});

owm.process = function (raw) {
  return {
    data: {
      description : raw.weather[0].description,
      icon: 'http://openweathermap.org/img/w/' + raw.weather[0].icon + '.png',
      sunset: raw.sys.sunset,
      temp: raw.main.temp,
      wind: raw.wind.speed
    },
    analysis: {
      isNight : raw.weather[0].icon[raw.weather[0].icon.length - 1] === critera.night,
      isTooCold : raw.main.temp < critera.tooCold,
      isTooHot : raw.main.temp > critera.tooHot,
      isTooWindy : raw.wind.speed > critera.tooWindy
    }
  };
};

app.get('/weather/:lat/:long/ready.json', function (req, resp) {
  owm.get('lat=' + req.params.lat + '&lon=' + req.params.long + '&mode=json', function (raw) {
    console.log(raw);
    resp.send(owm.process(raw));
  });
});

app.get('/weather/:place/ready.json', function (req, resp) {
  owm.get('q=' + req.params.place + '&mode=json', function (raw) {
    console.log(raw);
    resp.send(owm.process(raw));
  });
});

var port = process.env.PORT || 9000;
app.listen(port, function() {
  console.log("Listening on " + port);
});

