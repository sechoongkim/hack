'use strict';

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../api/users/user.model');
var config = require('config.json');

module.exports = new GoogleStrategy({
  clientID: config.googleClientId,
  clientSecret: config.googleClientSecret,
  callbackURL: config.googleCallbackUrl
}, function (token, refreshToken,  profile, triggerSerializationOfUser) {
  // this only runs when somebody logs in through google
  User.findOrCreate({
    where: {googleId: profile.id},
    defaults: {
      email: profile.emails[0].value,
      name: profile.displayName,
      photo: profile.photos[0].value
    }
  })
  .spread(function (user) {
    triggerSerializationOfUser(null, user);
  })
  .catch(triggerSerializationOfUser);
});
