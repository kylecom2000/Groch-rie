var db = require("../models");
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app, io) {
  // Load index landing page
  app.get("/", function(req, res) {
    res.render("index");
  });

  // Route for login page.
  app.get("/login", function(req, res) {
    res.render("login");
  });

  // Route for signup page.
  app.get("/signup", function(req, res) {
    res.render("signup");
  });


  // Route for dashboard with authentication and loading user's lists.
  app.get("/dashboard/user", isAuthenticated, function (req, res) {
    const thisUser = req.user ? req.user.id : 1;
    io.on("connection", function (socket) {
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
    const relTables = [];

    db.User.findAll({attributes: ["id", "nickName"]}).then(function(dbUsersAll) {
      const userDirectory = {};
      dbUsersAll.forEach(function(entry) {
        userDirectory[entry.id] = entry.nickName;
      });


    // This code block identifies the user, retrieves tables relevant to them, marked shared tables as editable or not depending on their category, and then sends the result to the renderer.
    db.User.findOne({ where: { id: 3 } }).then(function (dbUser) {


      dbUser.getWishlist({ include: ["Task", "Cheri", "Creator"] }).then(function (dbLists) {
        dbLists.forEach(function (entry) {
          delete entry.dataValues.Creator.dataValues.password;
          entry.editable = true;
          entry.Task.forEach(function(taskEntry) {
            taskEntry.originatorId = userDirectory[taskEntry.originatorId];
          });
          relTables.push(entry);
        });

        dbUser.getShared({ include: ["Task", "Cheri", "Creator"] }).then(function (dbLists) {

          dbLists.forEach(function (entry) {
            delete entry.dataValues.Creator.dataValues.password;
            entry.editable = entry.category === "Shared" ? true : false;
            entry.Task.forEach(function(taskEntry) {
              taskEntry.originatorId = userDirectory[taskEntry.originatorId];
            });
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
