const Sequelize = require("sequelize")
module.exports = function (sequelize, dataTypes) {

    const User = sequelize.define("User", {
        userName: {
            type: dataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1]
            }
        },
        nickName: {
            type: dataTypes.STRING,
        },
        password: {
            type: dataTypes.STRING,
            allowNull: false
        },
        createdAt: {
            type: dataTypes.DATETIME,
            defaultValue: Sequelize.NOW
        },
        updatedAt: {
            type: dataType.DATETIME,
            defaultValues: Sequelize.NOW
        }
    });

    User.addHook("beforeCreate", function(user, options) {
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(12), null);
    })

    User.associate = function (models) {
        User.hasMany(models.Task, {foreignKey: "originatorId", as: "originator"});
        User.hasMany(models.Task, {foreignKey: "completerId", as: "completer"});
        User.hasMany(models.List, {foreignKey: "creatorId", as: "creator"});
        User.belongsToMany(models.List, {through: "listViewers", as: "viewer", foreignKey: "viewerId"});
        User.belongsToMany(models.List, {through: "listUsers", as: "user", foreignKey: "userId"});
}

    return User;
}

