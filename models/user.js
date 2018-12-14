const Sequelize = require("sequelize");
const bcrypt = require("bcrypt-nodejs");
// const path = require("path");

module.exports = function(sequelize, dataTypes) {
    const User = sequelize.define("User", {
        userName: {
            type: dataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1],
                isEmail: true
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
            type: dataTypes.DATE(6),
            defaultValue: Sequelize.NOW()
        },
        updatedAt: {
            type: dataTypes.DATE(6),
            defaultValues: Sequelize.NOW()
        },
        currentSocket: {
            type: dataTypes.STRING,
            allowNull: true
        }
    });

    User.prototype.validPassword = function(password){
        return bcrypt.compareSync(password, this.password);
      };

    User.addHook("beforeCreate", function(user, options) {
        console.log(options);
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(12), null);
    });

    User.associate = function (models) {
        User.hasMany(models.Task, {foreignKey: "originatorId", as: "Request"});
        User.hasMany(models.Task, {foreignKey: "completerId", as: "Marker"});
        User.hasMany(models.List, {foreignKey: "creatorId", as: "Wishlist"});
        User.belongsToMany(models.List, {through: "listViewers", as: "Shared", foreignKey: "CheriId"});
    };

    return User;
};