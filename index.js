'use strict';

const API_TOKEN = "EAALirSQUH18BAPHJAr6aaZAxIGXy1LMjxsMNc8DQtJHh6MDagCeHPVp5eVkD2xCZAm3IDI8yZCH43cTLEIxzP5jKbJ6LpBuPFfRJ31r72pelJUzeAZBZBXPJlOIeznmpbqovMtE9fJk9beWTf3kdQEYeB94lolfZC2AcZAz3yXpeGSv5gKbON2F"
const express = require("express");
const bodyParser = require("body-parser");
const restService = express();
var mysql = require('mysql');
const request = require('request');

///const {WebhookCliente} = require('dialogflow-fulfillment');

restService.use(bodyParser.json());
restService.use(bodyParser.urlencoded({ extended: false }));

//Endpoint home
restService.post("/", function(req, res) {
  var name;
  //Connection DB

  //const agent = new WebhookCliente({request, response});
  //console.log('Request header'+ JSON.stringify(request.header));
  //console.log('Request header', JSON.stringify(request.header));
  
  name = getName(req.body.originalDetectIntentRequest.payload.data.sender.id);
  console.log(name);
  


  res.json({
    "fulfillmentMessages":[
    {
      "text":{
        "text":[
           name
        ]
     },
      "platform":"FACEBOOK",
      "lang":"es"
    },
    {
      "text":{
        "text":[
           ""
        ]
      },
      "lang":"es"
    }
    ]
  });
  
  console.log(req.body);
  
});


/*
 Funtion to return name of Facebook PSID (Page Scope ID)
*/
function getName(PSID) {
  if (PSID == undefined) {
    console.log("*********Use DialogFlow Test*********");
    return "**NameTest**";
  }else {
    request("https://graph.facebook.com/" + PSID + "?fields=first_name,last_name&access_token=" + API_TOKEN, function (error, response, body) {
      if (error) {
        console.log("STATUS CODE -> " + response.statusCode + " ERROR ->" + error);
        return undefined;
      }
      return body.first_name;
    });
  }
}

restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});