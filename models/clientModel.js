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
    this.conexion = new conexionDB();
  }

  /**
    *  Funstion to check
    * @param {*} PSID 
  */
  checkUser(PSID, callback) {
    let result = this.conexion.selectAllByID(PSID, "client", function (result) {
      console.log(result);
      return callback(result);
    })
    
  }

  save() {
    let result = this.conexion.insertInTable("client", ["id", "name"], [this.id, this.name]);
    console.log(result);
  }

}


module.exports = User;
    