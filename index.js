'use strict';

const {WebhookClient} = require('dialogflow-fulfillment');
const request = require('request');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements


// This parte of code we do a request to Api of FacebookMessenger for get the information of user
/*let id = req.body.originalDetectIntentRequest.payload.data.sender.id;
console.log(req.body);
//function probar(agent){
request("https://graph.facebook.com/" + id + "?fields=first_name,last_name&access_token=EAALirSQUH18BAPHJAr6aaZAxIGXy1LMjxsMNc8DQtJHh6MDagCeHPVp5eVkD2xCZAm3IDI8yZCH43cTLEIxzP5jKbJ6LpBuPFfRJ31r72pelJUzeAZBZBXPJlOIeznmpbqovMtE9fJk9beWTf3kdQEYeB94lolfZC2AcZAz3yXpeGSv5gKbON2F", function (error, response, body) {
  console.error('error:', error); // Print the error if one occurred
  console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    //console.add('Hola', body.first_name); // Print the HTML for the Google homepage.
  });*/

const agent = new WebhookClient({request: request});
console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
function welcome(agent) {
  agent.add(`Welcome to my agent!`);
}

function fallback(agent) {
  agent.add(`I didn't understand`);
  agent.add(`I'm sorry, can you try again?`);
}

function probarr(agent) {
  agent.add(`Hola Daniel`);
}

  // Run the proper function handler based on the matched Dialogflow intent name
let intentMap = new Map();
intentMap.set('Default Welcome Intent', welcome);
intentMap.set('Default Fallback Intent', fallback);
intentMap.set('probar', probarr);
agent.handleRequest(intentMap);


//Listen port
restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});