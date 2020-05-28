'use strict';
var mysql = require('mysql');
/**
 * 
 * 
 * 
 * 
 */

class DbModel {

    
  constructor() {
    //Connection on enviroment variable :D
    this.connection = mysql.createPool({
      host: "181.63.179.1",
      user: "pepito",
      password: "",
      database: "entubarrio"
      });
    }

  conn() {
    return this.connection;
  }

}

module.exports = DbModel;


