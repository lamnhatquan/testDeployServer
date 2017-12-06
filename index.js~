var express = require('express');
var Slack = require('./slack.seed');
//var app = express();
var path = require('path');
var mqtt = require('mqtt');
var socketIO = require('socket.io');
var mongo = require('mongodb');
var url = "mongodb://abc:abc@ds115436.mlab.com:15436/finger_id";
//var Table = require('markdown-table');
var table = require('easy-table');
var formatdate = require('dateformat');
var newUser;
var n_data = 0;

/*table([['Tên','Thời gian đến','Thời gian đi','Đi sớm (h)','Đi trễ (h)']]);

table()
*/
mongo.connect(url, function(err, db) {
  if (err) throw err;
  db.collection("FingerID").count({}, function(err, result) {
    if (err) throw err;
    console.log(result);
    n_data = parseInt(result);
    db.close();
  });
});

/*mongo.connect(url, function(err, db) {
  if (err) throw err;
  db.collection("FingerID").findOne({"fingerid": "1"}, function(err, result) {
    if (err) throw err;
    console.log(result.name);
    t.cell('name', result.name);
    t.cell('User', result.slack_user);
    t.newRow();
    console.log(t.toString())
    db.close();
  });
});
*/
/*
mongo.connect(url, function(err, db) {
  if (err) throw err;
  db.collection("FingerID").find({}).toArray(function(err, result) {
    if (err) throw err;
    result.forEach(function(data){
      t.cell('Tên', data.name);
      t.cell('Thời gian đến', data.slack_user);
      t.newRow();
    });
    console.log(t.toString());
    Table(result);
    slack.webhook({
      channel: "#sensor",
      username: "ESP8266",
      text: "```"+t.toString()+"```",
    }, function(err, response) {
      //console.log(response);
    });
    //console.log(result[0]);
    db.close();
  });
});

*/
//app.set('port', (process.env.PORT || 5000));

//app.use(express.static(path.join(__dirname, 'public')));


// views is directory for all template files
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');
/*
app.get('/', function(request, response) {
  response.render('pages/index');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
*/
//const INDEX = path.join(__dirname, 'pages/index');


const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const server = express()
.use(express.static(path.join(__dirname, 'public')))
.set('views', path.join(__dirname, 'views'))
.set('view engine', 'ejs')
.use((req, res) => res.end('hello')
.listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
  socket.on('register', function(message){
    newUser = message;
    console.log(newUser);
    n_data++;
    client.publish('/ESP8266/Register','GetID#'+n_data.toString());
  });
});

//setInterval(() => io.emit('complete', new Date().toTimeString()), 1000);



webhookUri = "https://hooks.slack.com/services/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";
//webhookUri = "https://hooks.slack.com/services/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";

slack = new Slack();
slack.setWebhook(webhookUri);

var client  = mqtt.connect({
  host: 'iot.eclipse.org',
  port: 1883,
  keepalive: 10,
  connectTimeout: 30*1000
});

client.on('connect', function () {
  client.subscribe('/Server/Register');
  client.subscribe('/Server/toSlack');
  client.publish('chrome_test', 'Hello mqtt');
  console.log("Someone connected!!!");
  slack.webhook({
    channel: "#gereral",
    username: "Server",
    text: "Server is ready !!!"
  }, function(err, response) {
    console.log(response);
  });
});

var UpdateInfo = function(db,message){
  console.log("hello");
  db.collection("FingerID").find({}).toArray(function(err, result) {
    if (err) throw err;
    var t = new table;
    result.forEach(function(data){
      t.cell('Tên', data.name);
      t.cell('Thời gian đến', data.timeCome);
      t.cell('Thời gian đi', data.timeLeave);
      t.cell('Đi sớm (h)', data.timeSoon);
      t.cell('Đi trễ (h)', data.timeLate);
      t.newRow();
    });
    console.log(t.toString());
    slack.webhook({
      channel: "#general",
      username: "ESP8266",
      text: "```"+t.toString()+"```"
    }, function(err, response) {
      
    });
    //db.close();
  });
}

client.on('message', function (topic, message) {
  // message is Buffer
  //console.log(message.toString());
  switch (topic){
    case '/Server/Register': 
      console.log("Register with ID = "+message.toString());
      mongo.connect(url, function(err,db) {
        if (err) throw err;
        var obj = {
          name: newUser.name,
          slack_user: newUser.slack_user,
          position: newUser.position,
          fingerid: n_data.toString(),
          timeCome: "",
          timeLeave: "",
          timeLate: 0,
          timeSoon: 0,
          state: "0"
        };
        console.log(obj.toString());
        db.collection("FingerID").insertOne(obj, function(err, res){
          if (err) throw err;
          console.log('1 object inserted !!!');
          db.close();
        });
      });
      io.emit('complete', message.toString());

      break;
    case '/Server/toSlack':
      console.log("Send to Slack: "+message.toString());
      mongo.connect(url, function(err, db) {
        if (err) throw err;
        var date = new Date;
        console.log(formatdate(date,"hh:MM:ss dd/mm/yyyy").toString());
        var state = "";
        db.collection("FingerID").findOne({"fingerid": message.toString()}, function(err,result){
          if (err) throw err;
          state = result.state.toString();
          //db.close();
        
        //console.log(state);
          if (state == "0"){
            console.log("helo");
            db.collection("FingerID").update({"fingerid": message.toString()},
            {
              $set: {"timeCome": formatdate(date,"hh:MM dd/mm/yyyy").toString(),
              "timeLeave": "",
              "state": "1"}
            }, function(err,result){
              if (err) throw err;
              //db.close();
            });
          } else if (state == "1") {
            db.collection("FingerID").update({"fingerid": message.toString()},
            {
              $set: {"timeLeave": formatdate(date,"hh:MM dd/mm/yyyy").toString(),
              "state": "0"}
            }, function(err,result){
              if (err) throw err;
              //db.close();
            });
          }
          UpdateInfo(db,message);
          db.close();
        });
        console.log("1");

        // db.collection("FingerID").find({}).toArray(function(err, result) {
        //   if (err) throw err;
        //   var t = new table;
        //   result.forEach(function(data){
        //     t.cell('Tên', data.name);
        //     t.cell('Thời gian đến', data.timeCome);
        //     t.cell('Thời gian đi', data.timeLeave);
        //     t.cell('Đi sớm (h)', data.timeSoon);
        //     t.cell('Đi trễ (h)', data.timeLate);
        //     t.newRow();
        //   });
        //   console.log(t.toString());
        //   slack.webhook({
        //     channel: "#general",
        //     username: "ESP8266",
        //     text: "```"+t.toString()+"```"
        //   }, function(err, response) {
            
        //   });
        //   db.close();
        // });
      });
      break;
  }
});