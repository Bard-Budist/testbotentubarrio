'use strict';

const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const bodyParser = require("body-parser");
const request = require('request');
const express = require("express");
const restService = express();

restService.use(bodyParser.json());
restService.use(bodyParser.urlencoded({ extended: false }));
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

restService.post("/", function(req, res) {
  const agent = new WebhookClient({ req, res });
  console.log('Dialogflow Request headers: ' + JSON.stringify(req.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(req.body));

function probarr(agent) {
  let id = req.body.originalDetectIntentRequest.payload.data.sender.id;
  console.log(req.body);
  //function probar(agent){
    request("https://graph.facebook.com/" + id + "?fields=first_name,last_name&access_token=EAALirSQUH18BAPHJAr6aaZAxIGXy1LMjxsMNc8DQtJHh6MDagCeHPVp5eVkD2xCZAm3IDI8yZCH43cTLEIxzP5jKbJ6LpBuPFfRJ31r72pelJUzeAZBZBXPJlOIeznmpbqovMtE9fJk9beWTf3kdQEYeB94lolfZC2AcZAz3yXpeGSv5gKbON2F", function (error, response, body) {
      console.error('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      //console.add('Hola', body.first_name); // Print the HTML for the Google homepage.
      agent.add(`Hola` + body.first_name);
    });
}

  // Run the proper function handler based on the matched Dialogflow intent name
let intentMap = new Map();
intentMap.set('probar', probarr);
agent.handleRequest(intentMap);
});

//Listen port
restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});