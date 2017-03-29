var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var proxy = require('proxy-middleware');
var hbs = require( 'hbs' ) ;
var helpers = require( 'handlebars-helpers' ) ;
var fs = require( 'fs' ) ;

var app = express();
var path = require('path');

//hbs setting
hbs.registerPartials( __dirname + '/views/partials/') ;
hbs.registerHelper('raw',function(options){
    return options.fn( this ) ;
});
hbs.registerHelper('section', function(name,options){
    this.sections = this.sections || {} ;
    this.sections[ name ] = options.fn( this ) ;
    return null ;
}) ;
hbs.localsAsTemplateData(app) ;
helpers(hbs) ;

//setup Application
app.disable( 'x-powered-by' ) ;
// view engine setup
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');


var envMap = {
    development: '-test',
    dev: '-test',
    test: '-test-d',
    staging: '-staging',
    production: ''
};
var suffix = envMap[process.env.NODE_ENV];
suffix = suffix === undefined ? '-test' : suffix;

app.use('/gw', proxy('http://saas-gw' + suffix + '.ehsy.com'));


var oldEnvMap = {
    development: '-test',
    dev: '-test',
    test: '-test',
    staging: '-staging',
    production: ''
}
var oldSuffix = oldEnvMap[process.env.NODE_ENV];
oldSuffix = oldSuffix === undefined ? '-test' : oldSuffix;

app.use('/cf', proxy('http://cf' + oldSuffix + '.ehsy.com'));


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use('/static', express.static(__dirname + '/static'));

//global var in hbs register
app.locals.static_url = process.env.STATIC_URL || '/static' ;

//custom router
app.use('/', require('./routes/home'));
app.use('/site',require('./routes/site'));
app.use('/passport',require('./routes/passport'));
app.use('/api',require('./routes/api'));
app.use(require('./routes/admin'));
app.use('/m_passport',require('./routes/m_passport'));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        if (err.status === 404) {
            res.redirect('/404');
        }else{
        res.render('error', {
            message: err.message,
            error: err
        });
        }
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    if (err.status === 404) {
        res.redirect('/404');
    }else {
        res.render('error', {
            message: err.message,
            error: {}
        });
    }
});

module.exports = app;
