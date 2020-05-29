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
  checkUser(PSID) {
    let result = this.conexion.selectAllByID(PSID, "client")
    console.log(result);
    if (result === []){
      return false;
    } else {
      return true;
    }
  }

  save() {
    let result = this.conexion.insertInTable("client", ["id", "name"], [this.id, this.name]);
    console.log(result);
  }

}


module.exports = User;
    