const User = require('../db').User;
const passport = require('passport');

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  if (req.url != '/favicon.ico') {
    req.session.redirectTo = req.url;
  }
  res.redirect('/login');
};

exports.isUser = async (req, res, next) => {
  let user = await User.findByPk(req.user.id);
  if (user.roleId > 0) {
    return next();
  }
  req.flash('error', ' Not Authorized to use application.');
  res.redirect('/login');
};

exports.registerPage = (req, res) => {
  res.render('register', {
    flashes: req.flash('error'),
  });
};

exports.registerUser = (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  User.register(username, password, async (error, registeredUser) => {
    if (error) {
      console.log(error);
      res
        .status(500)
        .send()
        .redirect('/login');
    }
    registeredUser.firstName = req.body.firstName;
    registeredUser.lastName = req.body.lastName;
    registeredUser.email = req.body.email;
    registeredUser.budget;
    registeredUser.totalEncumbered;
    registeredUser.totalSpent;
    registeredUser.balance;
    await registeredUser.save();
    req.flash('success', 'Welcome');
    next();
  });
};

exports.loginPage = (req, res) => {
  res.render('login-admin-user', {
    flashes: req.flash('error'),
  });
};

exports.loginUser = (req, res, next) => {
  let failDirect = '/' || '/login';
  passport.authenticate('local', {
    successRedirect: '/users',
    failureRedirect: failDirect,
    failureFlash: true,
    successFlash: 'Welcome',
  })(req, res, next);
};

exports.logoutUser = (req, res) => {
  req.logOut();
  res.redirect('/login');
};
