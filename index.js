var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var transporter = nodemailer.createTransport(smtpTransport({
  host: process.env.NODEMAILER_HOST,
  port: process.env.NODEMAILER_PORT,
  secure: true,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS
  }
}));

// Enable CORS (More info: http://enable-cors.org/)
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/contact', function(req, res) {
  var mailOptions = {
    from: 'Portfolio Contact <contact@dennmart.com>',
    to: 'dennis@dennmart.com',
    subject: 'Contact from Portfolio',
    text: 'From: ' + req.body.name + ' <' + req.body.email + '>\nmessage: ' + req.body.message
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.log(error);
      res.status(500).send({ 'error': error });
    } else {
      console.log('Message sent: ' + info.response);
      res.send({ 'message': 'Message sent! ' + info.response });
    }
  });
});

var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log("App running at http://%s:%s", host, port);
});
