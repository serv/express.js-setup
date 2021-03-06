var express        = require('express'),
    path           = require('path'),
    favicon        = require('serve-favicon'),
    logger         = require('morgan'),
    cookieParser   = require('cookie-parser'),
    bodyParser     = require('body-parser'),
    swig           = require('swig'),
    swigHelper     = require('./config/application/swig_helper'),
    mongoConnector = require('./config/db/mongo_connector'),
    passport       = require('passport'),
    flash          = require('flash'),
    session        = require('express-session'),
    app            = express();

// view engine setup
app.engine('html', swig.renderFile);

app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'html');

// Swig will cache templates for you, but you can disable
// that and use Express's caching instead, if you like:
app.set('view cache', false);
// To disable Swig's cache, do the following:
swigHelper.setup(swig);
// NOTE: You should always cache templates in a production environment.
// Don't leave both of these to `false` in production!

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
if ('development' === app.get('env')) {
  app.use(logger('dev'));
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('node-compass')({mode: 'expanded'}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components',  express.static(__dirname + '/bower_components'));

// TODO: need session secret
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET || 'Your Session Secret goes here'
}));

// Use passport
var passportConfig = require('./config/application/passport_config');
app.use(passport.initialize());
app.use(passport.session());

// Use Flash
app.use(flash());

// Set currentUser as user
app.use(function(req, res, next) {
  res.locals.user = req.user;
  next();
});

// Initialize routes
var router = require('./app/routes/routes.js');
app.use('/', router);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
if (app.get('env') === 'production') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
}

// init mongodb connection
mongoConnector.init();

module.exports = app;
