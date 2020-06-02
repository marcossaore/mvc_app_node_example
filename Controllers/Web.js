const Controller = require("./Controller")

class Web extends Controller {

    index() {
        this.Response.json({
            index: "index function inside controller"
        });
    }

    login() {

        if(this.Request.method  == "GET"){
            this.Response.send("<h3>Página de login!</h3>");
            return;
        }
        
        let {mail, password} = this.Request.body

        this.Response.json({
            login: "login function inside controller",
            mail,
            password
        });
    }
}

module.exports = Web;