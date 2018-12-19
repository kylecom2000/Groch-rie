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

// Socket related
sessionKey = "express.sid";
const cookieParser = require("cookie-parser")("keyboard dog");
app.use(cookieParser);
const MemoryStore = session.MemoryStore;
const sessionStore = new MemoryStore();

app.use(session({ secret: "keyboard dog", store: sessionStore, key: "express.sid", resave: true, saveUninitialize: true }));
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
db.sequelize.sync({ force: false }).then(function () {
  // require(path.join(__dirname, "./seeder/seeds.js"))(db);
  const server = app.listen(PORT, function () {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });

  // Socket setup
  const io = socket(server);

  io.use(function(socket, next) {
    const handshake = socket.request;
    // console.log("auth", "+++++++++++++++++++++++++++++++++++++++++");
    if (handshake.headers.cookie) {
      cookieParser(handshake, null, function(err) {
        // Use depends on whether you have signed cookies
        // handshake.sessionID = handshake.cookies[sessionKey];
        handshake.sessionID = handshake.signedCookies[sessionKey];
  
        sessionStore.get(handshake.sessionID, function(err, session) {
          // console.log("SESSION STORE: ", session);
          if (err || !session || !session.passport || !session.passport.user) {
            next(new Error("Error or no session."));
          } else {
            // console.log("setting session");
            handshake.headers.session = session;
            // console.log(handshake.session, "##########sessionset#########");
            next();
          }
        });
      });
    } else {
      next(new Error("No session cookie found."));
    }
  });

  io.on("connection", function (socket) {debugger;
    const thisUser = socket.handshake.headers.session.passport.user.id;
    // console.log("connection+++++++++++++++++++++++++++++++++++++++++++++++++++++");
    // console.log("connection session", session);
    db.User.update(
      {currentSocket: socket.id}, 
      {where: {id: thisUser}}
    );

    socket.on("disconnect", function(){
      db.User.update(
        {currentSocket: null},
        {where: {currentSocket: socket.id}}
      );
    });
  });

  // Routes
  require("./routes/apiRoutes")(app, io);
  require("./routes/htmlRoutes")(app, io);
});

module.exports = app;
