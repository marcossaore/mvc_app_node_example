
const Auth = require("./Auth")
const Controller = require("./Controller")

class App extends Controller {

    constructor(request, response) {

        super(request, response)

        if (!Auth.user()) {
            throw this.Response.send("<h1>Usuário não autenticado, por favor loga-se!</h1>")
        }

    }

    profile() {
        
        let {name, age, mail} = Auth.user();

        this.Response.json({
            name,
            age,
            mail,
        })
    }

    profileParent () {

        let { params, query } = this.Request;

        this.Response.json({
            name: "Nelson",
            age: 36,
            email: "nanana@gmail.com",
            params : params,
            query : query
        })
    }
}

module.exports = App