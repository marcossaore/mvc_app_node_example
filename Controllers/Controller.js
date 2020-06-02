class Controller {
    constructor(request, response) {
        this.Request = request
        this.Response = response;
    }

    set Request(request) {
        this.request = request;
    }

    get Request() {
        return this.request
    }

    set Response(response) {
        this.response = response;
    }

    get Response() {
        return this.response
    }
}

module.exports = Controller