'use strict';

const express = require("express");
const bodyParser = require("body-parser");
const restService = express();
var mysql = require('mysql');
const request = require('request');

restService.use(bodyParser.json());



//Endpoint home
restService.post("/", function(req, res) {
  //Connection DB


  let id = req.body.originalDetectIntentRequest.payload.data.sender.id;
  console.log(id);


  request("https://graph.facebook.com/" + id + "?fields=first_name,last_name&access_token=EAALirSQUH18BAPHJAr6aaZAxIGXy1LMjxsMNc8DQtJHh6MDagCeHPVp5eVkD2xCZAm3IDI8yZCH43cTLEIxzP5jKbJ6LpBuPFfRJ31r72pelJUzeAZBZBXPJlOIeznmpbqovMtE9fJk9beWTf3kdQEYeB94lolfZC2AcZAz3yXpeGSv5gKbON2F", function (error, response, body) {
    console.error('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    return res.json({
      speech: body.first_name,
      displayText: "nombre",
      source: 'agent'
    });
  });

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

//Listen port
restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});