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
  app.post("/api/user", function(req, res) {
    db.User.create(req.body).then(function(data) {
      console.log(data);
      res.redirect("/login");
    });
  });

  app.get("/api/test", function(req, res) {
    
  });

  app.put("/api/checkmark", function (req, res) {
    db.Task.update({ completed: req.body.completed }, { where: { id: req.body.id } }).then(function () {

        db.Task.findAll({ where: { id: message.id } }).then(function (data) {
            data[0].getList({ include: ["Cheri"] }).then(function (data) {
                data.Cheri.forEach(function (entry) {
                    if (entry.currentSocket) {
                        io.sockets.in(entry.currentSocket).emit("checkupdate", { id: message.id, completed: message.completed });
                    }
                    db.User.findAll({ where: { id: data.id } }).then(function (dbUser) {
                        if (dbUser[0].currentSocket) {
                            io.sockets.in(dbUser[0].currentSocket).emit("checkupdate", { id: message.id, completed: message.completed });
                        }
                        res.status(200).end();
                    });
                });
            });
        });

    });
  });
};
