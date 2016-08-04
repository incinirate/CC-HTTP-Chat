var http = require('http');
var firebase = require("firebase");
var fs = require('fs');
var FirebaseTokenGenerator = require("firebase-token-generator");

var Constants = require("./constants")

var tokenGenerator = new FirebaseTokenGenerator(fs.readFileSync("secret","utf8"));

firebase.initializeApp({
    serviceAccount: "serviceAccount.secret.json",
    databaseURL: "https://cc-http-chat.firebaseio.com",
    databaseAuthVariableOverride: {
        uid: "service-worker"
    }
});


http.createServer(function (req, res) {
    var token = tokenGenerator.createToken({ uid: "wow", some: "arbitrary", data: "here" });

    res.writeHead(200);
    res.end("It worked. (" + token + ")");
}).listen(Constants.port);

console.log("Opened websocket on port " + Constants.port);
