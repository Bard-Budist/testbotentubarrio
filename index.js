'use strict';

const graphQl = require("axios")
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion, Payload} = require('dialogflow-fulfillment');
const bodyParser = require("body-parser");
const express = require("express");
//Import package for postgres
const Promise = require('bluebird');
var cors = require('cors')
const Mesagges = require('./views/mesagges');
const mesagges = new Mesagges();
const requesthttp = require('request-promise-native');
const URLTOKEN = "EAAJVfaIQvZCwBABv61qkN2LrqUZCMQUsEbksnrsQo1Jd56mlMkhPV10yuJ8N8b2t5tGATZAnVSQGzUj6fVpFsVyU7t50xAHuyJT2G5mU7OKq7Eq3qhBm4eYw9NK3ZCX3qNklbzuVTBeW5cZB5Qtfx5jNvPxVNXrVpqrAOffLdOn9UCEsEdApq"
let existUser = false;
// Create instance of express, and parse data in JSON format
// urlencoded -> acts as a bridge between an operating system
// or database and applications, especially on a network
const restService = express();
restService.use(bodyParser.json());
restService.use(bodyParser.urlencoded({ extended: false }));
restService.use(cors())
process.env.DEBUG = 'dialogflow:debug';
// enables lib debugging statements


const url = 'https://api.entubarrio.co/graphql/';
const API_GENDER = "5ed861fc756fae13585e34e2"
const listStatus = [
  "https://github.com/Bard-Budist/testbotentubarrio/blob/testdaniel/Procesado.png?raw=true",
  "https://github.com/Bard-Budist/testbotentubarrio/blob/testdaniel/Recibido.png?raw=true",
  "https://github.com/Bard-Budist/testbotentubarrio/blob/testdaniel/EnReparto.png?raw=true",
  "https://github.com/Bard-Budist/testbotentubarrio/blob/testdaniel/Entregado.png?raw=true"
]
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
  updateWhereID: function (ID, nameTable, attrs){
    return graphQl({
      url: url,
      method: 'post',
      data: {
        query: `mutation update${nameTable}{
          update${nameTable}(id: "${ID}" input:
            ${attrs}
            )
          {
            ok,
          }
        }`
      }
    }).then(function (result) {
      console.log(result.data);
      
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
  checkUser : function (id, dataUser) {
    const promise = new Promise(function (resolve, reject) {
        let dbResult = database.selectAllByID(id,'client', ["name,", "address,"]);
        dbResult.then( function (result) {
          console.log(result.data);
          console.log(result.data.data.client);
          if (!result.data.errors) {
            existUser = true;
            result.data.data.client.first_name = result.data.data.client.name.split(' ')[0];
            dataUser = result.data.data.client;
            console.log(dataUser);
            resolve(dataUser);
            } else {
              console.log('This User not exits');
              existUser = false;
              requesthttp.get("https://graph.facebook.com/" + id + "?fields=name,first_name&access_token=" + URLTOKEN).then(jsonBody => {
                const body = JSON.parse(jsonBody);
                database.insertInTable(
                  'Client',
                  `{id: "${body.id}", name: "${body.name}"}`
                ).then(function (result) {
                  console.log(result.data);
                });
                console.log('este es el body:', body);
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
      const dbResult = database.selectAllByID(id, 'client', ["address,"]);
      dbResult.then(function (result) {
        dataUser = result.data.data.client.address.split('/')[1].trim();
        resolve(dataUser);
      });
      // dataUser.catch( function(error) {
      //   console.log('Error AddressUser: ' + error)
      // })
    });
    return promise;
  },

  getGender : async function (name, dataUser) {
    const genderResponse = await requesthttp.get(`https://genderapi.io/api/?name=${name}&key=${API_GENDER}`)
    return genderResponse;
  },

  getStatus : function (id, dataUser) {
    const promise = new Promise(function (resolve, reject) {
      const dbResult = database.selectAllByID(id, 'client', "orderSet { status, id }");
      dbResult.then(function (result) {
        let dataOrder = result.data.data.client.orderSet;
        dataUser = dataOrder[dataOrder.length - 1];
        resolve(dataUser);
      });
      dbResult.catch(function(error) {
        console.log(error);
        
      })
    })
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
async function processData (id, dataUser, value, name) {
  try {
    let result;
    switch (value) {
      case 1:
        result = await operaciones.addressUser(id, dataUser);
        break;
      case 2:
        result = await operaciones.getGender(name, dataUser);
        break;
      case 3:
        result = await operaciones.getStatus(id, dataUser);
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
  console.log(request.body.originalDetectIntentRequest.payload.data.sender);
  console.log('este es el ID :', id);
 
  
  /**
   * @function newSesion This function gets the id of the User who starts a conversation
   *            with the bot and wait for the information to be stored or consulted
   *            of User
   * @param {*} agent 
   */
  async function newSesion(agent) {
    let dataUser = {};
    //let genderResult = {};
    const resdataUser = await processData(id, dataUser);
    //const restdataGender = await processData(id, genderResult, 2, resdataUser.name);
    // add how paramenter , restdataGender
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
        'Client',
        `{address: "${cityBarrio}"}`
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
      'Client',
      `{address: "${resdataUser.address + '/' + address}"}`
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
      'Client',
      `{phoneNumber: "${PhoneNumber}"}`
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
      'Client',
      `{email: "${EmailUser}"}`
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

  async function StatusOrder(agent) {
    let data = {} 
    let numberUrl = 0;
    let msg = "";
    const resdataUser = await processData(id, data, 3);
    const status = resdataUser.status;
    console.log("Se imprime el estado");
    console.log(status);
    
      if (status === 'RECIBIDO'){
        msg = "Tu pedido a sido recibido";
        numberUrl = 1;
      } else if (status === 'EN_REPARTO'){
        msg = "Tu pedido esta en camino, no tardaremos!";
        numberUrl = 2;  
      } else if (status === 'ENTREGADO'){
        msg = "Tu pedido a sido entregado!🙂";
        numberUrl = 3
      } else {
        msg = "Tu pedido aun esta en proceso, se paciente!";
        numberUrl = 0;
      }
  
    agent.add(new Payload(agent.FACEBOOK, mesagges.OrderStatus(msg, numberUrl)))
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
intentMap.set('StatusOrder', StatusOrder);
agent.handleRequest(intentMap);
});


restService.post("/orderResponse", function(request, response){
  console.log(request.body.res.data.createOrder.order.id);
  const idOrder = request.body.res.data.createOrder.order.id;
  let request_body = {
    "recipient": {
        "id": request.body.psid
    },
    "message":
        mesagges.OrderStatus("Tu orden esta siendo procesada!✅", listStatus[0])
    
  };
  const options = {
    method: 'post',
    url: "https://graph.facebook.com/v7.0/me/messages?access_token=" + URLTOKEN,
    data: request_body,
    transformResponse: [(data) => {
      console.log(data)
      return data;
    }]
  };
  response.status(200).send("Response ok")
  graphQl(options)

});


restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});
