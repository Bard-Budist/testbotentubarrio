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
    constructor(id, name){
        this.id = id;
        this.name = name;
        this.phone = "";
        this.address = "";
        this.email = "";
        this.conexion = new conexionDB();
    }

    /**
     * Set phone number
     * @param {string} phone 
     */
    setPhone(phone) {
        this.phone = phone;
    }

    /**
     * 
     * @param {*} email 
     */
    setEmail(email) {
        this.phone = email;
    }
    
    /**
     * 
     * @param {*} address 
     */
    setAddress(address) {
        this.address = address;
    }

    /**
     * Get Phone number
     */
    getPhone() {
        return this.phone;
    }

    /**
     * Get email user
     */
    getEmail() {
        return this.phone;
    }

    /**
     * get Address user 
     */
    getAddress() {
        return this.address;
    }


    /**
    * 
    * @param {*} PSID 
   */
   static checkUser(PSID) {
    this.conexion.getConnection(function(err, conn) {
      if (err) {
        console.log("Error to try to connect DB");
      }
      console.log("Connected!");
      var sql = "SELECT * FROM client WHERE id = " + PSID;
      conn.query(sql, function (err, result) {
        if (err) {
          console.log("Error to try select user");
        }
        if (result) {
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
    