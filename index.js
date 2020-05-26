'use strict';

const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const bodyParser = require("body-parser");
const express = require("express");
const requesthttp = require('request-promise-native');
const DialogflowApp = require('actions-on-google').DialogflowApp;
const URLTOKEN = "EAALirSQUH18BAPHJAr6aaZAxIGXy1LMjxsMNc8DQtJHh6MDagCeHPVp5eVkD2xCZAm3IDI8yZCH43cTLEIxzP5jKbJ6LpBuPFfRJ31r72pelJUzeAZBZBXPJlOIeznmpbqovMtE9fJk9beWTf3kdQEYeB94lolfZC2AcZAz3yXpeGSv5gKbON2F"

// Create instance of express, and parse data in JSON format
// urlencoded -> acts as a bridge between an operating system or database and applications, especially on a network
const restService = express();
restService.use(bodyParser.json());
restService.use(bodyParser.urlencoded({ extended: false }));

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

// global endpoint for execute on intents
restService.post("/", function(request, response) {
  const agent = new WebhookClient({ request, response });
  const app = new DialogflowApp({ request, response });

function newSesion(agent) {
  let id = request.body.originalDetectIntentRequest.payload.data.sender.id;

  return requesthttp.get("https://graph.facebook.com/" + id + "?fields=first_name,last_name&access_token=" + URLTOKEN).then(jsonBody => {
    const body = JSON.parse(jsonBody);
    // Add response with a card and name of user
    agent.add(new Card({
      imageUrl: 'https://lh3.googleusercontent.com/proxy/GcA6CqAzJ94Q8GMS9RgKYkys-xXNX93K_JC0b8VuXj7oMcDcztpAX1hOZlZNfyEDQYyi12jwPBRqx1jkSuPtrl9XulREZF13ItQa2tkSWbxwfQBmQjVRqdkVNBz59ydfGWlCI8c_r4yCsgkzr4FyOagndcB1CQAhHglk6Y7nWgm_mtZjexI',
      title: body.first_name + ` Bienvenido`,
      text: 'Nos complace poder ayudarte, por favor indícanos tu ciudad',
    }));
    app.askForPermission('To locate you', app.SupportedPermissions.DEVICE_PRECISE_LOCATION);
    return Promise.resolve( agent );
});
}

// Run the proper function handler based on the matched Dialogflow intent name
let intentMap = new Map();
intentMap.set('Bienvenida', newSesion);
agent.handleRequest(intentMap);
});


/*
 Funtion to return name of Facebook PSID (Page Scope ID)
*/
function getName(PSID, callback) {
  if (PSID == undefined) {
    console.log("*********Use DialogFlow Test*********");
    return "**NameTest**";
  }else {
    request("https://graph.facebook.com/" + PSID + "?fields=first_name,last_name&access_token=" + API_TOKEN, function (error, response, body) {
      if (error) {
        console.log("STATUS CODE -> " + response.statusCode + " ERROR ->" + error);
        return undefined;
      }
      console.log(body);
      return callback(body);
    });
  }
}

restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});