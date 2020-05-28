'use strict';
const conexionDB = require('./dbModel');
/**
 * Class user 
 * Constructor: User(id {ID of user}, name {Name of user})
 */
class User {
    /**
     * Constructor (id, name)
     * @param {int} id ID of user
     * @param {string} name Name of user
    */
  constructor(){
    this.id = "";
    this.name = "";
    this.phone = "";
    this.address = "";
    this.email = "";
  }

  /**
    * 
    * @param {*} PSID 
  */
  checkUser(PSID) {
    let conexion = new conexionDB();
    conexion.conn().getConnection(function(err, conn) {
      if (err) {
        console.log("Error to try to connect DB");
      }
      console.log("Connected!");
      var sql = "SELECT * FROM client WHERE id = " + PSID;
      conn.query(sql, function (err, result) {
        if (err) {
          console.log("Error to try select user");
        }
        if (result.length > 0) {
          console.log("Usuario existe");
          console.log(result);
        } else {
          console.log("Usuarion no existe");
        }
      });
    });
  }
}


module.exports = User;
    