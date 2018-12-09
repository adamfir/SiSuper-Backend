var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var testingRouter = require('./routes/testings')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var eventRouter = require('./routes/events');
var attendanceRouter = require('./routes/attendances');
var reviewRouter = require('./routes/reviews');
var productRouter = require('./routes/products');
var invitationRouter = require('./routes/invitations');
var businessRouter = require('./routes/business');
var certificateRouter = require('./routes/certificates')

var app = express();

// connect to db
// connect to database
// db activated mongod.exe --dbpath "c:\mongodb\data"
mongoose.connect('mongodb://localhost:27017/SiSuper2', {
    useNewUrlParser: true
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Tell the bodyparser middleware to accept more data
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// storage
app.use(express.static('img'))
app.use('/testing', express.static(__dirname+'/testing'))


//routes
app.use('/testing', testingRouter)
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/events', eventRouter);
app.use('/attendances', attendanceRouter);
app.use('/reviews', reviewRouter);
app.use('/products', productRouter);
app.use('/invitations', invitationRouter);
app.use('/business', businessRouter)
app.use('/certificates', certificateRouter)

// cek up API
app.get('/test', (req, res, next) => {
  res.status(200).json({
    status: 200,
    message: 'ready to rock n roll!'
  })
})

// Header Jamu error CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Header', '*')
  if (req.method == 'OPTIONS'){
      res.header(
          'Access-Control-Allow-Methods',
          'PUT, POST, PATCH, DELETE, GET'    
      )
      return res.status(200).json({})
  }
  next()
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
