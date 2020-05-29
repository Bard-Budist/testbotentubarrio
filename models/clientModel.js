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
    *  Funstion to check
    * @param {*} PSID 
  */
  checkUser(PSID) {
    let conexion = new conexionDB();
    if (conexion.selectAllByID(PSID, "client") == []){
      return false;
    } else {
      return true;
    }
  }


}


module.exports = User;
    