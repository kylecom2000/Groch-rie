var db = require("../models");

module.exports = function(app) {
  // Load index page
  app.get("/", function(req, res) {
    db.List.findAll({
      include: ["Task"]
    }).then(function(data) {
      console.log(data);
      res.render("manage", {
        lists: data
      });
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
