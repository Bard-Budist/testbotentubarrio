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


  /**
   * 
   * @param {*} ID 
   * @param {*} nameTable 
   */
  selectAllByID(ID, nameTable) {
    this.connection.getConnection(function(err, conn) {
      if (err) {
        console.log("Error to try to connect DB");
      }
      var sql = `SELECT * FROM ${nameTable} WHERE id = ${ID}`;
      conn.query(sql, function (err, result) {
        if (err) {
          console.log(`ERROR TO SELECT ${nameTable}`);
        }
        console.log("Devuelvo algo")
        return result;

      });
    });
  }


  /**
   *  Select attributes in table with only
   * @param {String} ID ID
   * @param {Sring[]} fields List of attributes the table
   * @param {String} nameTable name of table in Data Base
   */
  selectAttrByID(ID, fields, nameTable) {
    this.connection.getConnection(function(err, conn) {
      if (err) {
        console.log("Error to try to connect DB");
      }
      var sql = `SELECT ${fields.toString()} FROM ${nameTable} WHERE id = ${ID}`;
      conn.query(sql, function (err, result) {
        if (err) {
          console.log(`ERROR TO SELECT ATTRIBUTES ${nameTable}`);
        }
        return Promise.resolve (result);
      });
    });
  }

  /**
   * 
   * @param {String} nameTable 
   * @param {String[]} attrs 
   * @param {String[]} values 
   */
  insertInTable(nameTable, attrs, values){
    this.connection.getConnection(function(err, conn) {
      if (err) {
        console.log("Error to try to connect DB");
      }
      var sql = `INSERT INTO ${nameTable} (${attrs.toString()}) VALUES (${values.toString()})`;
      conn.query(sql, function (err, result) {
        if (err) {
          console.log(`ERROR TO INSERT IN TABLE ${nameTable}` + err);
        }
        
        return Promise.resolve (result);
      });
    });
  }

}

module.exports = DbModel;


