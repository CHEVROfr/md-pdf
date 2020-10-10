var express = require('express')
var compression = require('compression')
var bodyParser = require("body-parser")
var session = require('express-session')
var fs = require("fs")

var mime_ext = require('mimetype-extension')

var tools = require("./res/scripts/tools")

/////CONF/////
var configs = require("./res/configs/configs")
configs.load()

//OBJET APP
var app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(compression())
app.use(session({
    secret: 'ssshhhhh',
    resave: false,
    saveUninitialized: false
}))
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  next()
})

// WEB CLIENT
app.get("/", (req, res) => require("./res/scripts/index").get(req, res))
app.post("/", (req, res) => require("./res/scripts/index").post(req, res))

/////////////////////////////////////FILES
.get("/files/:type/:fileName", (req, res) => {
    req.params.fileName.match(new RegExp(/\.([a-z]+?)$/))
    let fileExt = RegExp.$1

    let folder = req.params.type

    if(folder == "svg" || folder == "png" || folder == "jpg" || folder == "jpeg") {
        folder = "imgs"
    }

    fs.readFile("./res/public_res/" + folder + "/" + req.params.fileName, "", (err, data) => {
        if(err) {
            tools.sendErrors(404, req, res)
        }
        else {
            res.header('Access-Control-Allow-Origin', '*')
            res.setHeader("Content-Type", mime_ext.get(fileExt))
            res.send(data)
        }
    })
})

app.use((req, res) => {
    tools.sendErrors(404, req, res)
})
app.listen(configs.get("port"))
