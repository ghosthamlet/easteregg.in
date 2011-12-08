
// # Settings

  // ## Express
var express  = require('express')
  , port     = 3000
  , cacheAge = 24 * 60 * 60 * 1000

  // ## Common
  , fs       = require('fs')
  , colors   = require('colors')
  , gzippo   = require('gzippo')

  // # Good and bad
  // **TODO:** this should be added to Marak's `colors`
  //  (e.g. 'mystring'.bad -- which would prepend the red ✗)
  //
  //  Don't use error/success since that _could_ conflict with callbacks.
  , good = "  ✔ ".green
  , bad = "  ✗ ".red

  // ## Stylesheets
  , stylus   = require('stylus')
  , nib      = require('nib')

  // ## Logs
  , logs = {
      set: true,
      string: '\\n  ' + ':date'.bold.underline + '\\n\\n' + '  IP: '.cyan.bold
        + ' ' + ':remote-addr'.white + '\\n' + '  Method: '.red.bold
        + ':method'.white + '\\n' + '  URL: '.blue.bold + ':url'.white
        + '\\n' + '  Status: '.yellow.bold + ':status'.white + '\\n'
        + '  User Agent: '.magenta.bold + ':user-agent'.white
    }
  , css = {
      count: 0,
      debug: false,
      set: true,
      string: function() {
        return ''
          + '\n' + good + ' Stylus has detected changes and compiled new assets'
          + ' ' + this.count + ' times so far' + '\n';
      }
    }

  // ## Set cache busting for development purposes as a view middleware helper
  // This gets turned off in production mode, see below
  //
  //  (e.g. `views/layout.jade` uses this for appending .css/.js w/?v=timestamp)
  , cacheBusting = true

  // ## Stylus Compiler
  , compress = false // this is set to true in prod
  , linenos = true // this is set to false in prod
  , compiler = function(str, path) {
      if (css.set) {
        css.count++;
        var cssString = css.string();
        console.log(cssString);
      }
      return stylus(str)
        .set('filename', path)
        .set('compress', compress)
        .set('warn', false)
        .set('force', false)
        .set('firebug', false)
        .set('linenos', linenos)
        .use(nib());
    };

// ## Application Configuration
exports.bootApplication = function(app, db) {

  // ### Default Settings
  app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.favicon(__dirname + '/public/favicon.ico'));
    app.use(app.router);
  });

  // ### Development Settings
  //     For a quick start
  //     $ node server.js
  //     Or if you have installed nodemon via:
  //     $ npm install -g nodemon
  //     $ nodemon
  //     Then point your browser to <http://localhost:8080/>.
  app.configure('development', function() {
    app.use(stylus.middleware({
      src: __dirname + '/views',
      dest: __dirname + '/public',
      debug: css.debug,
      compile: compiler
    }));
    app.use(express.static(__dirname + '/public', { maxAge: cacheAge }));
    app.set('showStackError', true);
    if(logs.set) app.use(express.logger(logs.string));
  });

  // ### Staging Settings
  // **TODO**: Build out the configuration for this mode.
  // `$ NODE_ENV=staging node server.js`
  // Then point your browser to <http://localhost:8081/>.

  // ### Production Settings
  // `$ NODE_ENV=production node server.js`
  // Then point your browser to <http://localhost:6789>.
  //  (we're using port 6789 for production with apache mod_proxy for now)
  app.configure('production', function() {
    // ## Use express-uglify to minify JavaScript in production mode
    app.use(require('express-uglify').middleware({ src: __dirname + '/public' }));
    cacheBusting = false;
    compress = true;
    linenos = false;
    app.use(stylus.middleware({
      src: __dirname + '/views',
      dest: __dirname + '/public',
      debug: css.debug,
      compile: compiler
    }));
    // Enable gzip compression is for production mode only
    app.use(gzippo.staticGzip(__dirname + '/public', { maxAge: cacheAge }));
    // Disable stack error output
    app.set('showStackError', false);
    // Enable view caching
    app.enable('view cache');
  });

  // ### Dynamic View Helpers
  app.dynamicHelpers({
      request: function(req) {
        return req;
      }
    , base: function() {
        // Return the app's mount-point so that urls can adjust
        return '/' === app.route ? '' : app.route;
      }
    , cacheBusting: function() {
        return cacheBusting;
      }
  });
};

// ## Error Configuration
exports.bootErrorConfig = function(app) {
  // Since this is the last non-error-handling middleware use()d,
  //  we assume 404, as nothing else responded.
  app.use(function(req, res, next) {
    // The status option, or res.statusCode = 404 are equivalent,
    //  however with the option we get the "status" local available as well
    res.render('404', {
      layout: false,
      status: 404,
      title: 'Page not found :('
    });
  });

  //     Error-handling middleware, take the same form as regular middleware,
  //     however they require an arity of 4, aka the signature (err, req, res, next)
  //     when connect has an error, it will invoke ONLY error-handling middleware.
  //
  //     If we were to next() here any remaining non-error-handling middleware would
  //     then be executed, or if we next(err) to continue passing the error, only
  //     error-handling middleware would remain being executed, however here we
  //     simply respond with an error page.

  app.use(function(err, req, res, next) {
    // We may use properties of the error object here and next(err)
    // appropriately, or if we possibly recovered from the error, simply next().
    res.render('500', {
      layout: false,
      status: err.status || 500,
      error: err,
      showStack: app.settings.showStackError,
      title: 'Something went wrong, oops!'
    });
  });

};

// ## Load Routes
exports.bootRoutes = function(app) {
  var walk    = require('walk')
    , path    = require('path')
    , files   = []
    , dir     = path.join(__dirname, 'routes')
    , walker  = walk.walk(dir, { followLinks: false });

  walker.on('file', function(root, stat, next) {
    files.push(root + '/' + stat.name);
    next();
  });

  walker.on('end', function() {
    files.forEach(function(file) {
      require(file)(app);
    });
    // Always keep this route last
    exports.bootExtras(app);
  });
};

// ## Extras
exports.bootExtras = function(app) {
  app.get('*', function(req, res, next) {
    var url = req.url
      , ua = req.headers['user-agent'];
    // ## Block access to hidden files and directories that begin with a period
    if (url.match(/(^|\/)\./)) {
      res.end("Not allowed");
    }
    // ## Better website experience for IE users
    //  Force the latest IE version, in cases when it may fall back to IE7 mode
    if(ua && ua.indexOf('MSIE') && /htm?l/.test(ua)) {
      res.setHeader('X-UA-Compatible', 'IE=Edge,chrome=1');
    }
    // ## CORS
    //  <http://github.com/rails/rails/commit/123eb25#commitcomment-118920>
    //  Use ChromeFrame if it's installed, for a better experience with IE folks
    //  Control cross domain using CORS http://enable-cors.org
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });
};
