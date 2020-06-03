'use strict';

const graphQl = require("axios")
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
let existUser = false;
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
const url = 'http://177.71.195.136/graphql/';
/**
 * @description All operation with database
 */
let database = {
  /**
   * @param {*} ID of the User
   * @param {*} nameTable name of table in Data Base
   * @param {*} attrs List of attributes
   */
  selectAllByID: function(ID, nameTable, attrs) {
    return graphQl({
      url: url,
      method: 'post',
      data: {
        query: `{
          ${nameTable}(id: "${ID}") {
            ${attrs}
          }
        }`
      }
    })
  },

  /**
   *  Select attributes in table with only
   * @param {String} ID of the User
   * @param {Sring[]} fields List of attributes the table
   * @param {String} nameTable name of table in Data Base
   */
  selectAddressByID: function(ID, nameTable, attrs) {
    return graphQl({
      url: url,
      method: 'post',
      data: {
        query: `{
          ${nameTable}(id: "${ID}") {
            ${attrs}
          }
        }`
      }
    })
  },

  /**
   * @param {String} nameTable name of table in Data Base
   * @param {String[]} attrs atributs of one table
   * @param {String[]} values values of one table
   */
  insertInTable: function(nameTable, attrs){
    return graphQl({
      url: url,
      method: 'post',
      data: {
        query: `mutation create${nameTable}{
          create${nameTable}(input:
            ${attrs}
            )
          {
            ok,
          }
        }`
      }
    })
  },
    
  /**
   * @description Usage: (ID, tableName, [Column1, Column2], [Value1, Value2])
   * @param {*} ID  ID of client
   * @param {*} nameTable Name of table in Data base
   * @param {*} listColumn list of columns to update
   * @param {*} listValue  list of values in columns
   */
  updateWhereID: function (ID, nameTable, listColumn, listValue){
    let stringQuery = "";
    for (let i = 0; i < listColumn.length; i++) {
      stringQuery += `${listColumn[i]} = '${listValue[i]}'`
      if (i !== listColumn.length - 1) {
        stringQuery += ", ";
      }
    }
    console.log(stringQuery);
    db.none(`UPDATE ${nameTable} SET ${stringQuery} WHERE id = '${ID}'`)
      .then(function () {
        console.log("Update is ok");
      })
      .catch(function (err) {
        console.log(`Error to update in ${nameTable} Error= ${err}`);
        
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
   * @param {} dataUser Initial value of this dict is empty, in this part of code
   *                    we asig the data of a User
   */
  checkUser : async function (id, dataUser) {
    const promise = new Promise(function (resolve, reject) {
        let dbResult = database.selectAllByID(id,'client', ["name,", "address,"]);
        dbResult.then( function (result) {  
          console.log(result);
          console.log(result.data.data.client);
          if (!result.data.errors) {
            existUser = true;
            result.first_name = result.data.data.client.name.split(' ')[0];
            dataUser = result.data.data;
            resolve(dataUser);
            } else {
              console.log('This User not exits');
              existUser = false;
              requesthttp.get("https://graph.facebook.com/" + id + "?fields=name,first_name&access_token=" + URLTOKEN).then(jsonBody => {
                const body = JSON.parse(jsonBody);
                database.insertInTable(
                  'Client',
                  `id: "${body.id}", 'name': "${body.name}"`
                ).then(function (result) {
                  console.log(result.data);
                });
                console.log(body);
                dataUser = body;
                resolve(dataUser);
              });
            }
        });
      if (!dataUser) {
        reject(new Error('Not exist a array'))
      }
    });
    return promise;
  },

  addressUser : function (id, dataUser) {
    const promise = new Promise(function (resolve, reject) {
      const dbResult = database.selectAddressByID(id, 'client');
      dbResult.then(function (data) {
        dataUser = data[0].address.split('/')[1].trim();
        resolve(dataUser);
      });
      // dataUser.catch( function(error) {
      //   console.log('Error AddressUser: ' + error)
      // })
    });
    return promise;
  }
}

/**
* @function processData This asynchronous function waits for the existence of a user to be
*              evaluated with its id and return its data and then give WelcomeUser
* @param {String} id id of the User
* @param {} dataUser  dict is empty
* @param agent    
* */
async function processData (id, dataUser, value) {
  try {
    let result;
    switch (value) {
      case 1:
        result = await operaciones.addressUser(id, dataUser);
        break;
      default:
        result = await operaciones.checkUser(id, dataUser);
        break;
    }
    return result;
  } catch (err) {
    return console.log(err.message);
  }
}


// global endpoint for execute on intents
restService.post("/", function(request, response) {
  const agent = new WebhookClient({ request, response });
  let id = request.body.originalDetectIntentRequest.payload.data.sender.id;
  let mesagges = new Mesagges();
  
  /**
   * @function newSesion This function gets the id of the User who starts a conversation
   *            with the bot and wait for the information to be stored or consulted
   *            of User
   * @param {*} agent 
   */
  async function newSesion(agent) {
    let dataUser = {};  
    const resdataUser = await processData(id, dataUser)
    agent.add(new Payload(agent.FACEBOOK, mesagges.WelcomeUser(resdataUser)));
    return Promise.resolve( agent );
  }

  /**
   * @function cities_barrios response with barrios of each citys
   * @param {*} agent 
   */
  async function cities_barrios(agent) {
    if (existUser === false) {
      agent.add(new Payload(agent.FACEBOOK, mesagges.LocationUser()));
    } else {
      const dataAddress = await processData(id, {}, 1);
      agent.add(new Payload(agent.FACEBOOK, mesagges.AddressUser(dataAddress)));
    }
    return Promise.resolve( agent );
  }

  /**
   * @function save_cityBarrio save the information about the city and distrcid of the user
   * @param {*} agent 
   */
  function save_cityBarrio(agent) {
    let cityBarrio = request.body.queryResult.queryText;
    database.updateWhereID(
        id,
        'client',
        ['address'],
        [cityBarrio]
        );
    agent.add(new Payload(agent.FACEBOOK, mesagges.AddresHouse()));
    return Promise.resolve( agent );
  }

   /**
   * @function save_address save the house address and how to answer ask
   * by the phone number of the user 
   * @param {*} agent 
   */
  async function save_address(agent) {
    let dataUser = {};
    const resdataUser = await processData(id, dataUser);
    console.log(resdataUser);
    const address = request.body.queryResult.queryText;
    database.updateWhereID(
      id,
      'client',
      ['address'],
      [resdataUser[0].address.trim() + '/' + address]
    );
    agent.add(new Payload(agent.FACEBOOK, mesagges.PhoneNumber()));
    return Promise.resolve( agent );
  }

  /**
   * @function save_PhoneNumber save the user's phone number and how
   *  to answer ask about the user's email
   * @param {*} agent 
   */
  function save_PhoneNumber(agent) {
    let PhoneNumber = request.body.queryResult.queryText;
    database.updateWhereID(
      id,
      'client',
      ['phone_number'],
      [PhoneNumber]
    );
    agent.add(new Payload(agent.FACEBOOK, mesagges.EmailUser()));
    return Promise.resolve( agent );
  }

   /**
   * @function save_Email save the user email, and response
   * @param {*} agent 
   */
  function save_Email(agent) {
    let EmailUser = request.body.queryResult.queryText;
    database.updateWhereID(
      id,
      'client',
      ['email'],
      [EmailUser]
    )
    agent.add(new Payload(agent.FACEBOOK, mesagges.OrderUser()));
    return Promise.resolve( agent );
  }

  /**
   * @function order
   * @param {*} agent 
   */
  function fastOrder(agent) {
    agent.add(new Payload(agent.FACEBOOK, mesagges.OrderUser()));
    return Promise.resolve( agent );
  }

// Run the proper function handler based on the matched Dialogflow intent name
let intentMap = new Map();
intentMap.set('Bienvenida', newSesion);
intentMap.set('Comenzar', cities_barrios);
intentMap.set('ubicacion', save_cityBarrio);
intentMap.set('direccion', save_address);
intentMap.set('Phone_number', save_PhoneNumber);
intentMap.set('email', save_Email);
intentMap.set('Address', fastOrder);
agent.handleRequest(intentMap);
});

restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});
