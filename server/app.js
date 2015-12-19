var db = require ('./db/sqlscript.js');
var user = require('./models/models.js').user;
var sitter = require('./models/models.js').sitter;
var cookieParser = require('cookie-parser');
var uuid = require('uuid');

var express = require('express');
var parser = require('body-parser');
var app = express();


app.use(parser.json());
app.use(cookieParser());

var server = app.listen(3333, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('server listening at localhost:', port);
});

// Serve the client files
app.use(express.static("./../app"));
app.use('/bower_components', express.static('./../bower_components'))


app.post('/signup', function (req, res) {
  user.newUser(req.body)
    .then(function(data) {
      user.login(req.body)
        .then(function(sessionId) {
          console.log('applying sesssionId', sessionId)
          res.cookie('sessionId', sessionId);
          res.send(200, 'user logged in');
        })
    })

})

app.post('/signin', function (req, res) {
  user.login(req.body)
    .then(function(sessionId) {
      console.log('applying sesssionId', sessionId)
      res.cookie('sessionId', sessionId);
      res.send(200, 'user logged in');
    })
})

app.post('/signout', function (req, res ){
  user.logout(req.cookies.sessionId)
    .then(function() {
      res.cookie('sessionId', undefined);
      res.send(200, 'user logged out')
    })

})

app.get('/mytasks', function (req, res) {
  user.isAuthenticated(req.cookies.sessionId)
    .then(function(data){
      if(data){
        user.getTasks(data)
          .then(function(tasks){
            res.send(200, tasks);
          });
      } else{
        console.log('GET Tasks Failed or whatever');
      }
    })
})

app.post('/newtasks', function (req, res) {
  user.isAuthenticated(req.cookies.sessionId)
    .then(function(userId){
      if(userId){
        user.addTask(req.body, userId)
        res.send(200, 'Task Added');
      } else{
        console.log('user not authenticated');
      }
    })

})


// var testTrip = [
// { date: '12/3', time:'morning', task:'water plants', notes:'by the sink'},
// { date: '12/3', time:'afternoon', task:'walk dog', notes:'around the block'},
// { date: '12/3', time:'night', task:'get mail', notes:'mail key on counter'},
// { date: '12/4', time:'night', task:'get mail', notes:'mail key on counter'}
// ]

sitter.assignTask(14, 4);

var testUser = {
  username: 'asdfasdf',
  name: 'Test User',
  password: '1234',
  address: '432 mocking bird lane',
  phone: '12344567',
  email: 'donald@gmail.com'
};

var testLogin = {
  username: 'festus',
  password: '1234'
};

// user.login(testLogin)
//   .then(function(data) {
//     console.log('return from login', data);
//   })
// db.query("SELECT username FROM users WHERE username = 'festus'")
//   .then(function (data) {
//     console.log('data2: ', data)
//     console.log(Boolean(data));
//   })
//   .catch(function(error){
//     console.log('error',error);
//   })


// If we are being run directly, run the server.
if (!module.parent) {
  app.listen(app.get("port"));
  console.log("Listening on", app.get("port"));
}


