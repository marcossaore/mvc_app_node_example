var Session;

class Message {

    constructor(session){
        Session = session
    }

    set Session (session) {
        this.session = session
    }

    get Session () {
        return this.session
    }

    set Text (text) {
        this.text = text
    }

    get Text () {
        return this.text || null
    }

    set Type (type) {
        this.type = type
    }

    get Type () {
        return this.type || null
    }

    set Before (before) {
        this.before = before
    }

    get Before () {
        return this.before || null
    }

    set After (after) {
        this.after = after
    }

    get After () {
        return this.after || null
    }

    getText () {
        return this.Before + this.Text + this.After
    }

    getType () {
        return this.Type
    }

    setBefore (before) {
        this.Before = before
        return this
    }

    setAfter (after) {
        this.After = after
        return this
    }

    info (message) {
        this.Type = "info"
        this.text = message
        return this
    }

    sucess (message) {
        this.Type = "success"
        this.text = message
        return this
    }

    warning (message) {
        this.Type = "warning"
        this.text = message
        return this
    }

    render () {
        return `<div class='message ${this.getType()}'>${this.getText()}</div>`;
    }

    json () {
        return {
            error : this.getText()
        }
    }

    flash () {
        Session.flash = this;
    }
}

module.exports = Message