const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const db = require("../models");
console.log("USER USER");
passport.use(new LocalStrategy(
  {
    usernameField: "userName"
  },
  function(userName, password, done){
    db.User.findOne({
      where: {
        userName: userName
      }
    }).then(function(dbUser){
      if(!dbUser){
        return done(null, false, { message: "Incorrect Email"});
      } else if(!dbUser.validPassword(password)){
        return done(null, false, { message: "Incorrect password"});
      }
      return done(null, dbUser);
    });
  }
));

passport.serializeUser(function(user, cb){
  cb(null, user);
});
passport.deserializeUser(function(obj, cb){
  cb(null, obj);
});

module.exports = passport;
