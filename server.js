
//     easteregg.in - where you go to get your website's easter eggs
//     Copyright (c) 2011 Nick Baugh (niftylettuce@gmail.com)
//     MIT Licensed

// Built with [Expressling](http://expressling.com/)

// * Maintainer: [@niftylettuce](https://twitter.com/#!/niftylettuce)
// * Twitter: [@eastereggin](https://twitter.com/#!/eastereggin)
// * Facebook: <https://www.facebook.com/eastereggin>
// * Website: <http://easteregg.in/>
// * Github: <https://github.com/niftylettuce/expressling/>

// # Expressling

    // ## Express
var express = require('express')
  , app     = express.createServer()

    // ## Common
  , fs  = require('fs')

    // ## Config
    // Based on your project's needs, you should configure `package.json`
    //  accordingly to the [npm](http://npmjs.org) packages used.
    //
    // * <http://wiki.commonjs.org/wiki/Packages/1.0>
    //
  , config = require('./config.json')

    // ## Settings
  , settings = require('./settings')

    // ## Environment
  , env  = process.env.NODE_ENV || 'development'
  , port = process.env.PORT || config[env].port

// # Load settings
settings.bootApplication(app);
settings.bootRoutes(app);
settings.bootErrorConfig(app);

// # Start server
app.listen(port);
var appPort = port + '', // stringify that int!
    appEnv = env.toUpperCase();

// # Colorful status
console.log(''
  + '\n  EASTEREGG.IN SERVER LISTENING ON PORT '.rainbow
  + " ".white.inverse
  + appPort.white.inverse
  + " ".white.inverse
  + ' IN '.rainbow
  + " ".white.inverse
  + appEnv.white.inverse
  + " ".white.inverse
  + ' MODE '.rainbow
);
