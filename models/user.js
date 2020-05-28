'use strict';

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

}

module.exports = User;
    