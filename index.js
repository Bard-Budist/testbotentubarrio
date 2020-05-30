'use strict';

const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion, Payload} = require('dialogflow-fulfillment');
const bodyParser = require("body-parser");
const express = require("express");
//Import package for postgres
const Promise = require('bluebird');

const Mesagges = require('./views/mesagges');
const mesagges = new Mesagges();
const requesthttp = require('request-promise-native');
const URLTOKEN = "EAALirSQUH18BAPHJAr6aaZAxIGXy1LMjxsMNc8DQtJHh6MDagCeHPVp5eVkD2xCZAm3IDI8yZCH43cTLEIxzP5jKbJ6LpBuPFfRJ31r72pelJUzeAZBZBXPJlOIeznmpbqovMtE9fJk9beWTf3kdQEYeB94lolfZC2AcZAz3yXpeGSv5gKbON2F"

// Create instance of express, and parse data in JSON format
// urlencoded -> acts as a bridge between an operating system
// or database and applications, especially on a network
const restService = express();
restService.use(bodyParser.json());
restService.use(bodyParser.urlencoded({ extended: false }));

process.env.DEBUG = 'dialogflow:debug';
// enables lib debugging statements

/**
 *  @description Options with bluebird and permit to manage posgres-promise
*/
const options = {
  // Initialization Options
  promiseLib: Promise,
  error: function (error, event) {
    if (event.cn) {
        // A connection-related error;
        console.log("CN:", event.cn);
        console.log("EVENT:", error.message);
    }
  }
};

const pgp = require('pg-promise')(options);
const connectionString = 'postgres://bot:root2020@bottest.cclxe6kinott.us-east-1.rds.amazonaws.com:5432/entubarrio';
const db = pgp(connectionString);

/**
 * @description All operation with database
 */
let database = {
  /**
   * @param {*} ID of the User
   * @param {*} nameTable name of table in Data Base
   */
   selectAllByID: function(ID, nameTable) {
    return (db.query(`SELECT * FROM ${nameTable} WHERE id = '${ID}'`))
  },

  /**
   *  Select attributes in table with only
   * @param {String} ID of the User
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
   * @param {String} nameTable name of table in Data Base
   * @param {String[]} attrs atributs of one table
   * @param {String[]} values values of one table
   */
  insertInTable: function(nameTable, attrs, values){
    let stringValues = '('
    for (let i = 0; i < values.length; i++) {
      stringValues +=  "'" + values[i].toString() + "'" ;
      if (i !== values.length -1) {
        stringValues += ",";
      }
    }
    stringValues += ')';

    let stringAttr = '('
    for (let i = 0; i < attrs.length; i++) {
      stringAttr +=  attrs[i] ;
      if (i !== attrs.length -1) {
        stringAttr += ",";
      }
    }
    stringAttr += ')';

    console.log(stringAttr);
    
    db.none(`INSERT INTO ${nameTable}${stringAttr} VALUES ${stringValues}`)
    .then(function () {
      console.log(`Insert in table ${nameTable} is ok`);
    })
    .catch(function (err) {
      console.log(`fail insert to table in ${nameTable} Error: ${err}`);
    })
  }
    
}

/**
 * @operaciones  It contains functions to request the public information of a Fcaebook user and
 *               to verify if the user exists or not in the database if it is not, your information
 *               is passed to the database to be stored
 */
let operaciones = {
    /**
   * @param {String} id id of the User
   * @param {} text Initial value of this dict is empty, in this part of code
   *                        we asig the data of a User
   */
  checkUser : function (id, text) {
    const promise = new Promise(function (resolve, reject) {
        let dbResult = database.selectAllByID(id,'client');
        dbResult.then( function (data) {  
          if (data.length > 0) {
            data.first_name = data[0].name.split(' ')[0];
            text = data;
            resolve(text);
            } else {
              console.log('This User not exits');
              requesthttp.get("https://graph.facebook.com/" + id + "?fields=name,first_name&access_token=" + URLTOKEN).then(jsonBody => {
                const body = JSON.parse(jsonBody);
                database.insertInTable(
                  'client',
                  ['id', 'name'],
                  [body.id, body.name]
                );
                console.log(body);
                text = body;
                resolve(text);
              });
            }
        });
      if (!text) {
        reject(new Error('No existe un array'))
      }
    });
    return promise;
  }
}

/**
* @function processData This asynchronous function waits for the existence of a user to be
*              evaluated with its id and return its data and then give WelcomeUser
* @param {String} id id of the User
* @param {} text  dict is empty
* @param agent    
* */
async function processData (id, text, agent) {
  try {
    await operaciones.checkUser(id, text);
    
  } catch (err) {
    return console.log(err.message);
  }
}


// global endpoint for execute on intents
restService.post("/", function(request, response) {
  const agent = new WebhookClient({ request, response });
  let mesagges = new Mesagges();
  
  /**
   * @function newSesion This function gets the id of the User who starts a conversation
   *            with the bot and wait for the information to be stored or consulted
   *            of User
   * @param {*} agent 
   */
  async function newSesion(agent) {
    let id = request.body.originalDetectIntentRequest.payload.data.sender.id;
    let dataUser = {};  
    const resdataUser =await processData(id, dataUser, agent)
    agent.add(new Payload(agent.FACEBOOK, mesagges.WelcomeUser(resdataUser)));
    return Promise.resolve( agent );
  }

  /**
   * @function location
   * @param {*} agent 
   */
  function location(agent) {
    agent.add(new Payload(agent.FACEBOOK, mesagges.LocationUser()));
    return Promise.resolve( agent );
  }

  /**
   * @function order
   * @param {*} agent 
   */
  function order(agent) {
    agent.add(new Payload(agent.FACEBOOK, mesagges.OrderUser()));
    return Promise.resolve( agent );
  }

// Run the proper function handler based on the matched Dialogflow intent name
let intentMap = new Map();
intentMap.set('Bienvenida', newSesion);
intentMap.set('Comenzar', location);
intentMap.set('pedido', order);
agent.handleRequest(intentMap);
});

restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});
