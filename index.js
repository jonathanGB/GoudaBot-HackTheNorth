const express = require('express');
const fs = require('fs');
const https = require('https');

var app = express();

app.get('/', function (req, res) {
  res.send('Hello World! Wazzaaaaaa');
});

if (!process.env.CERT_PATH) {
	console.log('cert path is not present')
	process.exit()
}

var certOptions = {
  key: fs.readFileSync(`${process.env.CERT_PATH}privkey.pem`),
  cert: fs.readFileSync(`${process.env.CERT_PATH}cert.pem`),
  ca: fs.readFileSync(`${process.env.CERT_PATH}chain.pem`)
};

var server = https.createServer(certOptions, app).listen(443, () => {
    console.log("Server started");
});
