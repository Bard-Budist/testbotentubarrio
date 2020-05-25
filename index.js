'use strict';

const express = require("express");
const bodyParser = require("body-parser");
var mysql = require('mysql');
const restService = express();

restService.use(bodyParser.json());

restService.post("/", function(req, res) {
  //res.send(JSON.stringify(req.body.queryResult.queryText));

  var con = mysql.createConnection({
    host: "181.63.179.1",
    user: "pepito",
    password: "",
  });

  con.connect(function(err) {
    if (err) throw err;
    res.send(JSON.stringify({'Status':'OK DB'}));
  });
});

restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});




/*
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "INSERT INTO customers (name, address) VALUES ('Company Inc', 'Highway 37')";
  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  });
});
*/