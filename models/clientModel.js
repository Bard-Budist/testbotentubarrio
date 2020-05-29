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
    return new Promise(function(resolve, reject) {
      let data = conexion.selectAllByID(PSID, "client");
      
    });
  }

  save() {
    let conexion = new conexionDB();
    let result = conexion.insertInTable("client", ["id", "name"], [this.id, this.name]);
    console.log(result);
  }

}


module.exports = User;
    