'use strict';

const express = require("express");
const bodyParser = require("body-parser");
const restService = express();
var mysql = require('mysql');

restService.use(bodyParser.json());

restService.post("/", function(req, res) {
  //res.send(JSON.stringify(req.body.queryResult.queryText));
  //Connection DB
  var con = mysql.createConnection({
    host: "181.63.179.1",
    user: "pepito",
    password: "",
    database: "messages"
  });


  con.connect(function(err) {
    if (err) {
      console.log("Error");
    }
    //res.send(JSON.stringify({'Status':'OK DB'}));
    //String query
    var sql = "INSERT INTO base (msg) VALUES ('" + req.body.queryResult.queryText +"')";
    con.query(sql, function (err, result) {
      if (err) {
        console.log("Error");
      }
    });
    res.send(JSON.stringify({'Insert':'OK'}));
  });
  
});




restService.get('/webhook', (req, res) => {

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = "EAALirSQUH18BAPHJAr6aaZAxIGXy1LMjxsMNc8DQtJHh6MDagCeHPVp5eVkD2xCZAm3IDI8yZCH43cTLEIxzP5jKbJ6LpBuPFfRJ31r72pelJUzeAZBZBXPJlOIeznmpbqovMtE9fJk9beWTf3kdQEYeB94lolfZC2AcZAz3yXpeGSv5gKbON2F"
    
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});

restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});