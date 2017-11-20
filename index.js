var express = require('express');
var Slack = require('./slack.seed');
var app = express();

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
  /*slack.webhook({
    channel: "#sensor",
    username: "ESP8266",
    text: "This is posted to #sensor and comes from a bot named ESP8266."
  }, function(err, response) {
    console.log(response);
  });*/
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
