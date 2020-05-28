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

    
  /**
   * 
   * @param {*} PSID 
   */
  checkUser(PSID) {
    this.connection.getConnection(function(err, conn) {
      if (err) {
        console.log("Error to try to connect DB");
      }
      console.log("Connected!");
      var sql = "SELECT * FROM client;";
      conn.query(sql, function (err, result) {
        if (err) {
          console.log("Error to try select user");
        }
        if  (result != undefined) {
          console.log("Usuario existe");
          console.log(result);
          
        }
      });
    });
  }

}

module.exports = DbModel;


