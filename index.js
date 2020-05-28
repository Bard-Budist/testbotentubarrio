'use strict';

const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion, Payload} = require('dialogflow-fulfillment');
const bodyParser = require("body-parser");
const express = require("express");

// Import Views
const mesagges = require('./views/mesagges');

//Import model client
const Client = require('./models/clientModel');

const requesthttp = require('request-promise-native');
const URLTOKEN = "EAALirSQUH18BAPHJAr6aaZAxIGXy1LMjxsMNc8DQtJHh6MDagCeHPVp5eVkD2xCZAm3IDI8yZCH43cTLEIxzP5jKbJ6LpBuPFfRJ31r72pelJUzeAZBZBXPJlOIeznmpbqovMtE9fJk9beWTf3kdQEYeB94lolfZC2AcZAz3yXpeGSv5gKbON2F"

// Create instance of express, and parse data in JSON format
// urlencoded -> acts as a bridge between an operating system
// or database and applications, especially on a network
const restService = express();
restService.use(bodyParser.json());
restService.use(bodyParser.urlencoded({ extended: false }));

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

// global endpoint for execute on intents
restService.post("/", function(request, response) {
  const agent = new WebhookClient({ request, response });
  
  function newSesion(agent) {
    let id = request.body.originalDetectIntentRequest.payload.data.sender.id;
    let newClient = new Client();
    newClient.checkUser(id);

    return requesthttp.get("https://graph.facebook.com/" + id + "?fields=name,first_name&access_token=" + URLTOKEN).then(jsonBody => {
      const body = JSON.parse(jsonBody);
      
      // Add response with a card and name of user}
      agent.add(new Payload(agent.FACEBOOK, mesagges.WelcomeUser(body)));
      return Promise.resolve( agent );
    });
  }

  /**
   * 
   * @param {*} agent 
   */
  function ubicacion(agent) {
    agent.add(new Payload(agent.FACEBOOK, mesagges.LocationUser()));
    return Promise.resolve( agent );
  }

// Run the proper function handler based on the matched Dialogflow intent name
let intentMap = new Map();
intentMap.set('Bienvenida', newSesion);
intentMap.set('Comenzar', ubicacion);
agent.handleRequest(intentMap);
});

restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});
