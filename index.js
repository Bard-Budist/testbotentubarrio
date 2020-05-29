'use strict';

const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion, Payload} = require('dialogflow-fulfillment');
const bodyParser = require("body-parser");
const express = require("express");
//Import package for postgres
const Promise = require('bluebird');
var pgp = require('pg-promise')(options);
const Mesagges = require('./views/mesagges');
const requesthttp = require('request-promise-native');
const URLTOKEN = "EAALirSQUH18BAPHJAr6aaZAxIGXy1LMjxsMNc8DQtJHh6MDagCeHPVp5eVkD2xCZAm3IDI8yZCH43cTLEIxzP5jKbJ6LpBuPFfRJ31r72pelJUzeAZBZBXPJlOIeznmpbqovMtE9fJk9beWTf3kdQEYeB94lolfZC2AcZAz3yXpeGSv5gKbON2F"


/**
 *  @description Options with bluebird and permit to manage posgres-promise
 */
const options = {
  // Initialization Options
  promiseLib: Promise,
  error: function (error, e) {
    if (e.cn) {
        // A connection-related error;
        console.log("CN:", e.cn);
        console.log("EVENT:", error.message);
    }
  }
};

const connectionString = 'postgres://bot:root2020@bottest.cclxe6kinott.us-east-1.rds.amazonaws.com:5432/entubarrio';
var db = pgp(connectionString);


/**
 * @description All operation with database
 */
let database = {
  /**
   * 
   * @param {*} ID 
   * @param {*} nameTable 
   */
  selectAllByID: function(ID, nameTable) {
    db.any('SELECT * FROM client')
      .then(function (data) {
         return (data);
      })
      .catch(function (err) { 
        console.log("Fail select all id " + err);
       })
  },


  /**
   *  Select attributes in table with only
   * @param {String} ID ID
   * @param {Sring[]} fields List of attributes the table
   * @param {String} nameTable name of table in Data Base
   */
  selectAttrByID: function(ID, fields, nameTable) {
    this.connection.getConnection(function(err, conn) {
      if (err) {
        console.log("Error to try to connect DB");
      }
      var sql = `SELECT ${fields.toString()} FROM ${nameTable} WHERE id = ${ID.toString()}`;
      conn.query(sql, function (err, result) {
        if (err) {
          console.log(`ERROR TO SELECT ATTRIBUTES ${nameTable}`);
        }
        return result;
      });
    });
  },

  /**
   * 
   * @param {String} nameTable 
   * @param {String[]} attrs 
   * @param {String[]} values 
   */
  insertInTable: function(nameTable, attrs, values){
    this.connection.getConnection(function(err, conn) {
      if (err) {
        console.log("Error to try to connect DB");
      }
      var sql = `INSERT INTO ${nameTable} (${attrs.toString()}) VALUES (${values.toString()})`;
      conn.query(sql, function (err, result) {
        if (err) {
          console.log(`ERROR TO INSERT IN TABLE ${nameTable}`);
        }
        
        return Promise.resolve (result);
      });
    });
  }
}

//Import model client
//const Client = require('./models/clientModel');



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
  let mesagges = new Mesagges();
  

  /**
   * 
   * @param {*} agent 
   */
  function newSesion(agent) {
    let id = request.body.originalDetectIntentRequest.payload.data.sender.id;
    console.log(database.selectAllByID("dawdaw","adaw"))
      
    
      

      
    
      // return requesthttp.get("https://graph.facebook.com/" + id + "?fields=name,first_name&access_token=" + URLTOKEN).then(jsonBody => {
      //   const body = JSON.parse(jsonBody);
      //   newClient.id = id;
      //   newClient.name = body.name;
      //   newClient.save();
      //   // Add response with a card and name of user}
      //   agent.add(new Payload(agent.FACEBOOK,  mesagges.WelcomeUser(body)));
      //   return Promise.resolve( agent );
      // });
    
    agent.add("Mira la consola🙄");
    
    
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
