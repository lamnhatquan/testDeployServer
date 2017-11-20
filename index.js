var express = require('express');
var Slack = require('./slack.seed');
var app = express();
var mqtt = require('mqtt');
var client  = mqtt.connect({
  host: 'm14.cloudmqtt.com',
  port: 14439,
  username: 'okzxtdhr',
  password: 'vFlJrrfn3lf0'
});

client.on('connect', function () {
  client.subscribe('server');
  client.publish('chrome_test', 'Hello mqtt');
});

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString());
  slack.webhook({
    channel: "#sensor",
    username: "ESP8266",
    text: message.toString(),
  }, function(err, response) {
    console.log(response);
  });
  client.end();
});

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

webhookUri = "https://hooks.slack.com/services/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";

slack = new Slack();
slack.setWebhook(webhookUri);

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
  console.log("Someone connected!!!");
  slack.webhook({
    channel: "#sensor",
    username: "Server",
    text: "Server is ready !!!"
  }, function(err, response) {
    console.log(response);
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
