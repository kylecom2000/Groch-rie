var db = require("../models");

module.exports = function(app, io) {
  // This route assumes that the user is known and given as req.user.id (may need to come from passport).
  // It further expects the front end has formatted the request in json with fields for the text of the task, price, and the list it belongs to.
  app.post("/api/task", function(req, res) {
    db.Task.create({
      text: req.body.text,
      price: req.body.price,
      originatorId: req.user.id,
      listId: req.body.list
    }).then(function(data) {
      // console.log(data);
      res.json(data);
    });
  });

  // This route assumes that the user is known and given as req.user.id (may need to come from passport).
  // It further expects that the front end has formatted te request in json with fields for the title and category.
  // Should it allow you to have shared it already?
  app.post("api/list", function(req, res) {
    db.List.create({
      title: req.body.title,
      category: req.body.category,
      creatorId: req.user.id
    }).then(function(data) {
      // console.log(data);
      res.json(data);
    });
  });

  // Since the user is being created, all the data is coming in the body.
  app.post("/api/user/signup", function(req, res) {
    db.User.create(req.body).then(function(data) {
      console.log(data);
      res.redirect("/login");
    });
  });

  // User logins
  app.post("/api/user/login", function(req, res) {

  });
  // For list
  app.post("/api/list/create", function(req, res) {
    db.List.create(req.body).then(function(data) {
      res.json(data);
    });
  });

  app.delete("/api/list/delete/:id", function(req, res) {
    db.Task.destroy({where: {id: req.params.id}}).then(function(data) {
      res.json(data);
    });
  });

  // For Task
  app.post("/api/task/create", function(req, res) {
    db.Task.create(req.body).then(function(data) {
      res.json(data);
    });
  });

  app.delete("/api/task/delete/:id", function(req, res) {
    db.Task.destroy({where: {id: req.params.id}}).then(function(data) {
      res.json(data);
    });
  });

  // This route assumes that the desired sharers appear in the req.body as follows: {users: [nickNames]}
  app.put("/api/list/share", function(req, res) {
    db.User.findAll({where: {nickName: req.body.users}}).then(function (data) {
      db.List.addCheri(data).then(function(data2) {
        res.json(data2);
      });
    });
  });

  app.put("/api/task/checkbox", function (req, res) {
    db.Task.update({ completed: req.body.completed }, { where: { id: req.body.id } }).then(function (data) {

        res.json(data);

    });
  });

  app.get("/api/test", function(req, res) {

  });
};
