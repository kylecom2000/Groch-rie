var db = require("../models");

module.exports = function(app, io) {
  function emitToList (tableId, eventType, message) {
    db.List.findOne({ where: { id: tableId }, include: ["Cheri", "Creator"] })
    .then(function (data) {
      const targetSockets = [];
      if (data.Creator.currentSocket) {
        targetSockets.push(data.Creator.currentSocket);
      }
      data.Cheri.forEach(function (entry) {
        if (entry.currentSocket) {
          targetSockets.push(entry.currentSocket);
        }
      });

      targetSockets.forEach(function (entry) {
        io.sockets.in(entry).emit(eventType, message);
      });
    });
  }

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
    const newTask = req.body;
    newTask.creatorId = req.user ? req.user.id : 1;
    
    db.Task.create(newTask).then(function(data) {
      res.json(data);
      
      // Find the sockets of the people who are relevant to that list and broadcast to them.
      emitToList(req.body.listId, "task-create", newTask);
      
    });
  });

  app.delete("/api/task/delete/:id", function (req, res) {

    // Find the list before deleting the item 
    db.Task.findOne({ where: { id: req.params.id }, include: ["List"] })
      .then(function (data) {
        const targetListId = data.list.id;


        db.Task.destroy({ where: { id: req.params.id } }).then(function (data) {
          res.json(data);

          // Find the sockets of the people who are relevant to that list and broadcast to them.
          emitToList(targetListId, "task-delete", req.params.id);

        });

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
