'use strict';

const express = require("express");
const bodyParser = require("body-parser");

const restService = express();

restService.use(
  bodyParser.urlencoded({
    extended: true
  })
);

restService.use(bodyParser.json());

restService.post("/", function(req, res) {
  res.send(JSON.stringify(request.body));
});

restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});

