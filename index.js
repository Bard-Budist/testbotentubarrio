'use strict';

const {WebhookClient} = require('dialogflow-fulfillment');
const template = require('./templates');
const {Card, Suggestion, Payload} = require('dialogflow-fulfillment');
const bodyParser = require("body-parser");
const express = require("express");
const requesthttp = require('request-promise-native');
const URLTOKEN = "EAALirSQUH18BAPHJAr6aaZAxIGXy1LMjxsMNc8DQtJHh6MDagCeHPVp5eVkD2xCZAm3IDI8yZCH43cTLEIxzP5jKbJ6LpBuPFfRJ31r72pelJUzeAZBZBXPJlOIeznmpbqovMtE9fJk9beWTf3kdQEYeB94lolfZC2AcZAz3yXpeGSv5gKbON2F"

// Create instance of express, and parse data in JSON format
// urlencoded -> acts as a bridge between an operating system or database and applications, especially on a network
const restService = express();
restService.use(bodyParser.json());
restService.set("view engine", "ejs");
restService.use(bodyParser.urlencoded({ extended: false }));

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

// global endpoint for execute on intents
restService.post("/", function(request, response) {
  const agent = new WebhookClient({ request, response });
  response.render("index");
  function newSesion(agent) {
    let id = request.body.originalDetectIntentRequest.payload.data.sender.id;

    return requesthttp.get("https://graph.facebook.com/" + id + "?fields=name,first_name&access_token=" + URLTOKEN).then(jsonBody => {
      const body = JSON.parse(jsonBody);
      // Add response with a card and name of user}
      agent.add(new Payload(agent.FACEBOOK, template.normalTemplate(
        body.first_name + ` Bienvenido`,
        'Soy Elin, el bot de EnTuBarrio',
        'https://lh3.googleusercontent.com/proxy/GcA6CqAzJ94Q8GMS9RgKYkys-xXNX93K_JC0b8VuXj7oMcDcztpAX1hOZlZNfyEDQYyi12jwPBRqx1jkSuPtrl9XulREZF13ItQa2tkSWbxwfQBmQjVRqdkVNBz59ydfGWlCI8c_r4yCsgkzr4FyOagndcB1CQAhHglk6Y7nWgm_mtZjexI',
        [
          {
            title: 'Comenzar Orden',
            type: 'postback',
            payload: 'comenzar',
          },
          {
            title: 'Soporte',
            type: 'postback',
            payload: 'soporte',
          }
        ]
      )));
    return Promise.resolve( agent );
});
}
  function ubicacion(agent) {
    agent.add(new Payload(agent.FACEBOOK, [template.normalTemplate(
      'Medellín',
      'Selecciona tu barrio',
      'https://medellin.travel/wp-content/uploads/2018/10/Plaza-Botero3.jpg',
      [
        {
          title: 'Poblado',
          type: 'postback',
          payload: 'poblado',
        },
        {
          title: 'Ciudad del Rio',
          type: 'postback',
          payload: 'ciudad del rio',
        }
      ]
    ), template.normalTemplate(
      'Pereira',
      'Selecciona tu barrio',
      'https://blogapi.uber.com/wp-content/uploads/2017/06/viaducto-pereira-panoramio.jpg',
      [
        {
          title: 'Macarena',
          type: 'postback',
          payload: 'macarena',
        },
        {
          title: 'Castilla',
          type: 'postback',
          payload: 'castilla',
        }
      ]
    )]));
  return Promise.resolve( agent );
  }

  function probar_numero(agent) {
    agent.add(new Payload(agent.FACEBOOK, template.numberTemplate()));
    return Promise.resolve( agent );
  }

  function probar_email(agent) {
    agent.add(new Payload(agent.FACEBOOK, template.emailTemplate()));
    return Promise.resolve( agent );
  }


  function probar_web(agent) {
    let response = {
      type: "web_url",
      title: "Test EnTuBarrio",
      url: "https://www.originalcoastclothing.com",
      messenger_extensions: true
    };

    return agent.add(new Payload(agent.FACEBOOK, response));
  }
// Run the proper function handler based on the matched Dialogflow intent name
let intentMap = new Map();
intentMap.set('Bienvenida', newSesion);
intentMap.set('Comenzar', ubicacion);
intentMap.set('probarnumero', probar_numero);
intentMap.set('probaremail', probar_email);
intentMap.set('probarweb', probar_web);
agent.handleRequest(intentMap);
});

restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});
