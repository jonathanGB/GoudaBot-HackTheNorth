const express = require('express');
const fs = require('fs');
const https = require('https');

var app = express();

app.get('/', function (req, res) {
  res.send('Hello World! Wazza');
});

app.listen(80, function () {
  console.log('Example app listening on port 80!');
});

/*var certOptions = {
    ca: fs.readFileSync('../pebble-localize_win.ca-bundle'),
    key: fs.readFileSync('../pebble-localize-ssl.pem'),
    cert: fs.readFileSync('../pebble-localize_win.crt')
};*/

/*var server = https.createServer(certOptions, app).listen(port, () => {
    console.log("Server started");
}); */
