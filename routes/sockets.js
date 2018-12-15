var db = require("../models");

module.exports = function (socket, io) {
    socket.on("disconnect", function (socket) {
        db.User.update({ currentSocket: null }, { where: { currentSocket: socket.id } }).then(function (data) {
            console.log(data);
        });
    });

    console.log("sockets.js variable io:", io);


};