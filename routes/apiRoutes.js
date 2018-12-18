var db = require("../models");
const passport = require("passport");

module.exports = function(app, io) {

  // this function sends a message to all of the users authorized for a list.
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
    db.User.create(req.body).then(function() {
      res.json("/login");
    });
  });

  // User login
  app.post("/api/user/login", passport.authenticate("local"), function(req, res) {
    console.log(req.body);
    res.json("/dashboard/user");
  });

  // User log out
  app.get("/api/user/logout", function(req, res){
    req.logout();
    res.redirect("/");
  });

  // Post request for list
  app.post("/api/list/create", function(req, res) {
    newList = req.body;
    newList.creatorId = req.user ? req.user.id : 1;
    db.List.create(req.body).then(function(data) {
      res.json(data);
    });
  });

  // Delete request
  app.delete("/api/list/delete/:id", function(req, res) {
    db.List.destroy({where: {id: req.params.id}}).then(function(data) {
      res.json(data);
    });
  });

  // Post request for Task
  app.post("/api/task/create", function(req, res) {
    const newTask = req.body;
    newTask.originatorId = req.user ? req.user.id : 1;

    db.Task.create(newTask).then(function(data) {
      res.json(data);

      newTask.taskId = data.dataValues.id;
      newTask.nickName = req.user ? req.user.nickName : "bob";
      // Find the sockets of the people who are relevant to that list and broadcast to them.
      emitToList(req.body.listId, "task-create", newTask);

    });
  });

  // Delete task
  app.delete("/api/task/delete/:id", function (req, res) {

    // Find the list before deleting the item
    db.Task.findOne({ where: { id: req.params.id }, include: ["List"] })
      .then(function () {
        const targetListId = req.params.id;


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

  //  Update route for checkboxes.
  app.put("/api/task/checkbox", function (req, res) {
    const taskCompleter = req.user ? req.user.id : 1;
    db.Task.update({ completed: req.body.completed, completerId: taskCompleter}, { where: { id: req.body.id } }).then(function (dbUpdate) {
      console.log(dbUpdate);
      res.json(dbUpdate);

      db.Task.findOne({ where: { id: req.body.id }, include: ["List"] })
        .then(function (data) {

          const message = {id: req.body.id};
          message.completerNick = req.user ? req.user.nickName : "bob";
          // Find the sockets of the people who are relevant to that list and broadcast to them.
          emitToList(data.List.id, "task-update", message);


        });

    });
  });


  // Sets all of the checks for particular list to uncompleted
  app.put("/api/list/reuse/", function(req, res) {
    db.Task.update({ completed: 0 }, { where: { listId: req.body.id } }).then(function(data) {
      res.json(data);
    });
  });

  app.get("/api/test", function(req, res) {
    console.log("api/test get route req:", req);
    res.end();
  });

};
