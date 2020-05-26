'use strict';

const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const bodyParser = require("body-parser");
//const requesthttp = require('request');
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
  const requesthttp = require('request-promise-native');
  let id = request.body.originalDetectIntentRequest.payload.data.sender.id;
  console.log(request.body);

  return requesthttp.get("https://graph.facebook.com/" + id + "?fields=first_name,last_name&access_token=EAALirSQUH18BAPHJAr6aaZAxIGXy1LMjxsMNc8DQtJHh6MDagCeHPVp5eVkD2xCZAm3IDI8yZCH43cTLEIxzP5jKbJ6LpBuPFfRJ31r72pelJUzeAZBZBXPJlOIeznmpbqovMtE9fJk9beWTf3kdQEYeB94lolfZC2AcZAz3yXpeGSv5gKbON2F").then(jsonBody => {
    var body = JSON.parse(jsonBody);
    agent.add(new Card({
      imageUrl: 'https://lh3.googleusercontent.com/proxy/GcA6CqAzJ94Q8GMS9RgKYkys-xXNX93K_JC0b8VuXj7oMcDcztpAX1hOZlZNfyEDQYyi12jwPBRqx1jkSuPtrl9XulREZF13ItQa2tkSWbxwfQBmQjVRqdkVNBz59ydfGWlCI8c_r4yCsgkzr4FyOagndcB1CQAhHglk6Y7nWgm_mtZjexI',
      title: body.first_name + ` Bienvenido`,
      text: 'Nos complace poder ayudarte, por favor indícanos tu ciudad',
    }));
    return Promise.resolve( agent );
});
  //agent.add('hola ' + requestFacebook(request));
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