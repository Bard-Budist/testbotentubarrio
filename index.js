'use strict';

const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const bodyParser = require("body-parser");
const express = require("express");
const restService = express();
restService.use(bodyParser.json());
restService.use(bodyParser.urlencoded({ extended: false }));
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

restService.post("/", function(request, response) {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

function probarr(agent) {
  agent.add(`Hola Daniel`);
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