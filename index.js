'use strict';

const express = require("express");
const bodyParser = require("body-parser");
const restService = express();
var mysql = require('mysql');

restService.use(bodyParser.json());

restService.post("/", function(req, res) {
  //res.send(JSON.stringify(req.body.queryResult.queryText));

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
    var sql = "INSERT INTO base (msg) VALUES ('" + req.body.queryResult.queryText +"')";
    con.query(sql, function (err, result) {
      if (err) {
        console.log("Error");
        
      }
      
      
    });
    res.send(JSON.stringify({'Insert':'OK'}));
  });
  
});

restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});