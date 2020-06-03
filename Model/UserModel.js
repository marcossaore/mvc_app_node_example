const Model = require("./../Core/Model")

class UserModel extends Model {
    constructor(session){
        super("users", ["id"], ["first_name", "last_name", "email", "password"], session)
    }

    bootstrap (
        first_name,
        last_name,
        email,
        password,
        document
    ) {
        this.first_name = first_name
        this.last_name = last_name
        this.email = email
        this.password = password
        this.document = document
    }

    async findByEmail (email, columns = "*") {
        let find = await this.find(columns).andWhere({email : email})
        return find.fetch()
    }   
}   

module.exports = UserModel