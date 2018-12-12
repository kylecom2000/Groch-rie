var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    db.Example.findAll({}).then(function(dbExamples) {
      res.render("index", {
        msg: "Welcome!",
        examples: dbExamples
      });
    });
  });

  // Load example page and pass in an example by id
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
