const Sequelize = require("sequelize");
module.exports = function (sequelize, dataTypes) {

    const Task = sequelize.define("Task", {
        text: {
            type: dataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        price: {
            type: dataTypes.DECIMAL(10,2),
            validate: {
                isFloat: true
            }
        },
        completed: {
            type: dataTypes.BOOLEAN,
            defaultValues: false
        },
        createdAt: {
            type: dataTypes.DATE(6),
            defaultValue: Sequelize.NOW()
        },
        updatedAt: {
            type: dataTypes.DATE(6),
            defaultValues: Sequelize.NOW()
        }
    });
    
    Task.associate = function(models) {
        Task.belongsTo(models.User, {as: "originator", foreignKey: "originatorId"});
        Task.belongsTo(models.User, {as: "completer", foreignKey: "completerId"});
        Task.belongsTo(models.List, {as: "list", foreignKey: "listId"});
    }
    
    return Task;
}