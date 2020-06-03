const {host, database, user, password} = require("../config");

class Connect {

    static getInstance (connectionInterface) {
        return connectionInterface.createConnection(
            host, 
            database,
            user,
            password
        );
    }
}

module.exports = Connect