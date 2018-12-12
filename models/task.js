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
            type: dataTypes.dataType.DECIMAL(10, 2),
            allowNull: true,
            validate: {
                isFloat: true
            }
        },
        completed: {
            type: dataTypes.BOOLEAN,
            defaultValues: false
        }
    });
    
    Task.associate = function(models) {
        Task.belongsTo(models.User, {as: "originator", foreignKey: "originatorId"});
        Task.belongsTo(models.User, {as: "completer", foreignKey: "completerId"});
        Task.belongsTo(models.List, {as: "list", foreignKey: "listId"});
    }
    
    return Task;
}

