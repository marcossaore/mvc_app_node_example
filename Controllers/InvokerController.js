class InvokerController {

    constructor(source = "./") {
        this.Source = source
    }

    set Source (source) {
        this.source = source;
    }

    get Source () {
        return this.source;
    }

    call(controller) {
        return (request, response) => {
            let splitControllerClassAndMethod = controller.split(":");
            let controllerToInvoker = require(this.Source + splitControllerClassAndMethod[0]);
            let invokingClass = new controllerToInvoker(request, response);
            let methodToExecute = splitControllerClassAndMethod[1];
            invokingClass[methodToExecute]();
        } 
    }

}

module.exports = InvokerController;