const bodyParser = require('body-parser')
const app = require('express')()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

require("./routes")(app)

app.listen(3000, function () {
    console.log(` Application listening on port 3000`)
})