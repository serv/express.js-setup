var _              = require('lodash'),
    Q              = require('q'),
    passport       = require('passport'),
    User           = require('../models/user'),
    passportConfig = require('../../config/application/passport_config');

var usersController = {
  index: function(req, res) {
    var template = 'users/index',
    options = {};

    options = {
      title:     'This is users page',
      firstName: 'Jason',
      lastName:  'Kim'
    };
    User.all()
    .then(
      function (docs) {
        options.users = docs;
        res.render(template, options);
      },
      function(error) {
        res.render(template, options);
      },
      function(progress) {
      }
    );
  },

  signIn: function(req, res) {
    var options;

    options = {
      title: 'Sign in'
    };

    res.render('users/sign_in', options);
  },

  signUp: function(req, res) {
    var options = {
      title: 'Sign up'
    };

    res.render('users/sign_up', options);
  },

  signInPost: function(req, res) {
    passport.authenticate('local', function(err, user, info) {
      return res.redirect('/sign_in');
    })(req, res);
  },

  show: function(req, res) {
    User.find({username: req.params.username})
    .then(
      function(docs) {
        var options = {
          title: 'Overview for ' + docs.username,
          username: docs.username,
          email: docs.email
        };

        return res.render('users/show', options);
      },
      function(error) {
        // TODO: display 404
      }
    );
  },

  signUpPost: function(req, res) {
    // TODO: need error handling
    var user = new User({
      username: req.body.username,
      email:    req.body.email,
      password: req.body.password
    });

    User.find({username: user.username})
    .then(
      function(docs) {

        if (_.isEmpty(docs)) {
          return User.find({email: user.email});
        } else {
          throw new Error();
        }
      },
      function(error) {
        console.log(1);
      }
    )
    .then(
      function(docs) {

        if (_.isEmpty(docs)) {
          return user.save();
        } else {
          throw new Error();
        }
      },
      function(error) {
        req.flash('danger', 'Sorry, the username, ' + user.username + ' is already taken.');
        return res.redirect('/sign_up');
      }
    )
    .then(
      function(docs) {
        req.flash('success', 'Thank you for signing up, ' + docs.username);
        return res.redirect('/');
      },
      function(error) {
        req.flash('danger', 'Sorry, ' + user.email + ' is already used to sign up.');
        return res.redirect('/sign_up');
      }
    )
    .fail(function (error) {
      // TODO: Error handling
    });;

  }
};

module.exports = usersController;
