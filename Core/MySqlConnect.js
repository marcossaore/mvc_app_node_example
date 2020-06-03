const mysql = require("mysql")

class MySqlConnect {
    createConnection(
        host,
        database,
        user,
        password
    ){
        this.Connection = mysql.createConnection({
            host,
            database,
            user,
            password
        })

        return this;
    }

    set Connection (connection) {
        this.connection = connection
    }

    get Connection () {
        return this.connection
    }

    query (query, callback) {
        return this.Connection.query(query, callback);
    }

    engine () {
        return this.Connection
    }
}

module.exports = MySqlConnect