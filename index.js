'use strict';

const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion, Payload} = require('dialogflow-fulfillment');
const bodyParser = require("body-parser");
const express = require("express");
//Import package for postgres
const Promise = require('bluebird');

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
var pgp = require('pg-promise')(options);

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
    return (db.query(`SELECT * FROM ${nameTable} WHERE id = '${ID}'`))
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

//Import model client
//const Client = require('./models/clientModel');


let operaciones = {
  checkUser : function (id, text) {
    const promise = new Promise(function (resolve, reject) {
      setTimeout(function() {
        let dbResult = database.selectAllByID(id,'client')
          dbResult.then( function (data) {  
            console.log(data.length)
            console.log(data);
            console.log(data[0].name.split(' ')[0]);
            if (data.length > 0) {
              data.first_name = data[0].name.split(' ')[0];
              text = data
              resolve(text)
            }
          //   else {
          //     console.log('No exits');
          //     requesthttp.get("https://graph.facebook.com/" + id + "?fields=name,first_name&access_token=" + URLTOKEN).then(jsonBody => {
          //       const body = JSON.parse(jsonBody);
          //       database.insertInTable(
          //         'client',
          //         ['id', 'name'],
          //         [body.id, body.name]
          //       );
          //       dataUser = body;
          //       console.log(body);
          //   });
          // }
          
        })
        
        
      }, 1000);
      
      if (!text) {
        reject(new Error('No existe un array'))
      }
    })
    
    return promise

  }

}

// Create instance of express, and parse data in JSON format
// urlencoded -> acts as a bridge between an operating system
// or database and applications, especially on a network
const restService = express();
restService.use(bodyParser.json());
restService.use(bodyParser.urlencoded({ extended: false }));

process.env.DEBUG = 'dialogflow:debug';
 // enables lib debugging statements
async function processData (id, text) {
  try {
    const result = await operaciones.checkUser(id, text);
    console.log(result)
  } catch (err) {
    return console.log(err.message);
  }
}
// global endpoint for execute on intents
restService.post("/", function(request, response) {
  const agent = new WebhookClient({ request, response });
  let mesagges = new Mesagges();
  
  /**
   * @param {*} agent 
   */

  async function newSesion(agent) {
    let id = request.body.originalDetectIntentRequest.payload.data.sender.id;
    let dataUser = {};  
    await processData(id, dataUser)
    agent.add("Test");
    return Promise.resolve( agent );
    
  }

  /**
   * 
   * @param {*} agent 
   */
  function ubicacion(agent) {
    agent.add(new Payload(agent.FACEBOOK, mesagges.LocationUser()));
    return Promise.resolve( agent );
  }

  function order(agent) {
    agent.add(new Payload(agent.FACEBOOK, mesagges.OrderUser()));
    return Promise.resolve( agent );
  }

// Run the proper function handler based on the matched Dialogflow intent name
let intentMap = new Map();
intentMap.set('Bienvenida', newSesion);
intentMap.set('Comenzar', ubicacion);
intentMap.set('pedido', order);
agent.handleRequest(intentMap);
});

restService.listen(process.env.PORT || 8000, function() {
  console.log("Server up and listening");
});
