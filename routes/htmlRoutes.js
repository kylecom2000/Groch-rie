var db = require("../models");

module.exports = function(app, io) {
  // Load index page
  app.get("/", function(req, res) {
    res.render("index");
  });

  app.get("/login", function(req, res) {
    res.render("login");
  });

  app.get("/signup", function(req, res) {
    res.render("signup");
  });

  app.get("/dashboard/user", function(req, res) {


    const thisUser = req.user ? req.user.id : 1;
    io.on("connection", function (socket) {
      db.User.update({currentSocket: socket.id}, {where: {id: thisUser}}).then(() => {
      });
    });

    const relTables = [];
    // This code block identifies the user, retrieves tables relevant to them, marked shared tables as editable or not depending on their category, and then sends the result to the renderer.
    db.User.findOne({where: { id: thisUser}}).then(function(dbUser) {debugger;

      dbUser.getWishlist({include: ["Task", "Cheri", "Creator"]}).then(function (dbLists) {
        dbLists.forEach(function (entry) {
          entry.editable = true;
          relTables.push(entry);

          dbUser.getShared({include: ["Task", "Cheri", "Creator"]}).then(function(dbLists) {
            
            dbLists.forEach(function(entry) {
              entry.editable = entry.category === "Shared" ? true : false;
              relTables.push(entry);
            });

            res.render("dashboard", {
              lists: relTables
            });
          });
        });
      });
      
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
