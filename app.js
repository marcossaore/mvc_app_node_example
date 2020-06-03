const bodyParser = require('body-parser')
const app = require('express')()
const session = require('express-session')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}))

require("./routes")(app)

app.listen(3000, function () {
    console.log(` Application listening on port 3000`)
})