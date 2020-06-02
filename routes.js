const InvokerController = require("./Controllers/InvokerController")
const Invoker = new InvokerController();

module.exports = (app) => {
    app.get("/", Invoker.call("Web:index"));
    app.get("/login", Invoker.call("Web:login"));
    app.post("/login", Invoker.call("Web:login"));

    //Auth routes
    app.get("/profile", Invoker.call("App:profile"));
    app.get("/profile/:parentId", Invoker.call("App:profileParent"));

};