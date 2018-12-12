var db = require("../models");

module.exports = function (app) {
  // Get all examples
  app.get("/api/examples", function (req, res) {
    db.Example.findAll({}).then(function (dbExamples) {
      res.json(dbExamples);
    });
  });

  // Create a new example
  app.post("/api/examples", function (req, res) {
    db.Example.create(req.body).then(function (dbExample) {
      res.json(dbExample);
    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function (req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function (dbExample) {
      res.json(dbExample);
    });
  });

  // This route assumes that the user is known and given as req.user.id (may need to come from passport).
  // It further expects the front end has formatted the request in json with fields for the text of the task, price, and the list it belongs to.
  app.post("/api/task", function (req, res) {
    db.Task.create({
      text: req.body.text,
      price: req.body.price,
      originatorId: req.user.id,
      listId: req.body.list
    })
      .then(function (data) {
        console.log(data);
        res.json(data);
      });
  });

  // This route assumes that the user is known and given as req.user.id (may need to come from passport).
  // It further expects that the front end has formatted te request in json with fields for the title and category.
  // Should it allow you to have shared it already?
  app.post("api/list", function (req, res) {
    db.List.create({
      title: req.body.title,
      category: req.body.category,
      creatorId: req.user.id
    })
      .then(function (data) {
        console.log(data);
        res.json(data);
      });
  });

  // Since the user is being created, all the data is coming in the body.
  app.post("/api/user", function (req, res) {
    db.User.create(req.body)
      .then(function (data) {
        console.log(data);
        res.redirect("/login");
      });
  });

};
