var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    // db.Example.findAll({}).then(function(dbExamples) {
    //   res.render("index", {
    //     msg: "Welcome!",
    //     examples: dbExamples
    //   });
    // });

    res.render("signup");
  });

  // This route feeds the user all the data they need to render their dashboard page.
  // TODO: add handlebars-ready flags to each list item that specify whether that item was originated by the current user - that will affect the user's rights to delete or not.
  app.get("/user/dash", function (req, res) {
    const fullData = {};

    db.User.getviewables({ where: { viewerId: req.user.id } })
      .then(function (data) {

          console.log(data);
          fullData.viewables = data

        db.User.getusables({ where: { viewerId: req.user.id } })
          .then(function (data) {

            console.log(data);
            fullData.usables = data

            res.render("", fullData);
          });
      });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
