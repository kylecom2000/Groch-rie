// require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");
const passport = require("./config/passport");
const session = require("express-session");
const path = require("path");
const socket = require("socket.io");

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





var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

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
  const io = socket(server);
  // Routes
  require("./routes/apiRoutes")(app, io);
  require("./routes/htmlRoutes")(app, io);
});

module.exports = app;
