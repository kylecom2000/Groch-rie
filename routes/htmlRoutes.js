var db = require("../models");

module.exports = function(app, io) {
  // Load index page
  app.get("/", function(req, res) {
    res.render("landing");
  });

  app.get("/login", function(req, res) {
    res.render("login");
  });

  app.get("/signup", function(req, res) {
    res.render("signup");
  });

  app.get("/dashboard/user", function(req, res) {

    let lastUser = req.user ? req.user.id : 1;
    io.on("connection", function (socket) {
      db.User.update({currentSocket: socket.id}, {where: {id: lastUser}}).then(() => {
        lastUser = null;
      });
    });


    db.List.findAll({
      include: ["Task", "Cheri", "Creator"]
    }).then(function(data) {
      res.render("dashboard", {
        lists: data
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
