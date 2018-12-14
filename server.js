// require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");
const passport = require("./config/passport");
const session = require("express-session");
const path = require("path");
const socket = require("socket.io");
const socketRoutes = require("./routes/sockets.js");

const db = require("./models");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(session({ secret: "keyboard dog", resave: true, saveUninitialize: true }));
app.use(passport.initialize());
app.use(passport.session());

// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// TOCHANGE!!! this will take the http user and feed it to the socket user. NOT A GOOD PLAN!!!
let lastUser = null;
// This route feeds the user all the data they need to render their dashboard page.
// TODO: add handlebars-ready flags to each list item that specify whether that item was originated by the current user - that will affect the user's rights to delete or not.
app.get("/user/dash", function (req, res) {
  const fullData = {};

  lastUser = req.user;
  db.User.getviewables({ where: { viewerId: req.user.id } })
    .then(function (data) {

      console.log(data);
      fullData.viewables = data;

      db.User.getusables({ where: { viewerId: req.user.id } })
        .then(function (data) {

          console.log(data);
          fullData.usables = data;

          res.render("", fullData);
        });
    });
});

console.log("LAST USER", lastUser);
// Routes
require("./routes/apiRoutes")(app, io);
require("./routes/htmlRoutes")(app);



var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

var io;

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync({ force: true }).then(function () {
  require(path.join(__dirname, "./seeder/seeds.js"))(db);
  const server = app.listen(PORT, function () {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });

  // Socket setup
  io = socket(server);

  io.on("connection", function (socket) {
    console.log(socketId.id);
    db.User.update({ currentSocket: socket.id }, { where: { id: 1 } }).then(function (data) {
      console.log(data);
      lastUser = null;
    });
    socketRoutes(socket, io);
  });

});

module.exports = app;
