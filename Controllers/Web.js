const Controller = require("./Controller")
const UserModel = require("./../Model/UserModel")

class Web extends Controller {

    async index() {

        const userModel = new UserModel(this.Request.session)

        // const result = await userModel.delete("id = 1")

        // await userModel.findByEmail("@example.com");

        // userModel.data

    //    await model.create({name : "Antonio", email : "@antonio"})

    //    model.Data

        this.Response.json({
            index: "index function inside controller",
            // data: model.Data, 
            // count : count
        });



    }

    login() {

        if (this.Request.method == "GET") {
            this.Response.send("<h3>Página de login!</h3>");
            return;
        }

        let { mail, password } = this.Request.body

        this.Response.json({
            login: "login function inside controller",
            mail,
            password
        });
    }
}

module.exports = Web;