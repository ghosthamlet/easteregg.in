
//     easteregg.in
//     Copyright (c) 2011 Nick Baugh <niftylettuce@gmail.com>
//     MIT Licensed
//     <http://easteregg.in/>

// # Global Variables
var footer
  , something_keys = []
  , typeKeys = []
  , konamiCheck
  , konami_keys
  , dblClickCheck
  , somethingCheck
  , peelCornerCheck
  , dragLogoCheck
  , harmonyCheck
  , cornify_add
  , msg
  , something;

// # Fatalities
var fatalities = {
      triggers: {
        // **konamiCode**
        konamiCode: {
          audio: "konamicode",
          run: function(path, fx) {
            var konami_keys = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65],
                konami_index = 0,
                unicorn = konamiCheck(path, fx, false),
                handler = function(e) {
                  if(e.keyCode === konami_keys[konami_index++]) {
                    if(konami_index === konami_keys.length) {
                      $.fancybox.close();
                      $(document).unbind('keydown', handler);
                      $.getScript(path, function() {
                        unicorn();
                      });
                    }
                  } else {
                    konami_index = 0;
                  }
                };
            $(document).bind('keydown', handler);
          },
          unbind: function() {
            $(document).unbind('keydown');
          }
        },
        // **doubleClickFooter**
        doubleClickFooter: {
          audio: "doubleclick",
          run: function(path, fx) {
            $("#" + footer).dblclick(function() {
              $(this).unbind("dblclick");
              $.getScript(path, function(data, status) {
                var unicorn = dblClickCheck(path, fx, false);
                unicorn();
              });
            });
          },
          unbind: function() {
            $("#" + footer).unbind("dblclick");
          }
        },
        // **typeSomething**
        typeSomething: {
          audio: "typesomething",
          run: function(path, fx) {
            var typeKeys = something_keys,
                something_index = 0,
                unicorn = somethingCheck(path, fx, false),
                handler = function(e) {
                  if(e.keyCode === typeKeys[something_index++]) {
                    if(something_index === typeKeys.length){
                      $.fancybox.close();
                      $(document).unbind('keydown', handler);
                      $.getScript(path, function() {
                        unicorn();
                      });
                    }
                  } else {
                    something_index = 0;
                  }
                };
            $(document).bind('keydown', handler);
          },
          unbind: function() {
            $(document).unbind("keydown");
          }
        },
        // **peelCorner**
        peelCorner: {
          audio: "peelcorner",
          run: function(path, fx) {
            // By Elliott Kember <http://elliottkember.com/sexy_curls.html>
            var link = $("<link>");
            link.attr({
              rel: 'stylesheet',
              // http://elliottkember.com/turn/turn.css
              href: "http://cdn.easteregg.in/triggers/turn/turn.css",
              type: 'text/css',
              media: 'screen'
            });
            $("head").append(link);
            // http://elliottkember.com/turn/jqueryui.js
            $.getScript("http://cdn.easteregg.in/triggers/turn/jqueryui.js", function() {
              // http://elliottkember.com/turn/turn.js
              $.getScript("http://cdn.easteregg.in/triggers/turn/turn.js", function() {
                // http://elliottkember.com/turn/code.png
                $("body").prepend('<img id="target" src="http://cdn.easteregg.in/triggers/turn/code.png" alt="" />');
                $("#target").fold({
                  directory: 'http://cdn.easteregg.in/triggers/turn',
                  side: 'left',
                  turnImage: 'fold.png',
                  maxHeight: 400,
                  startingWidth: 10,
                  startingHeight: 10,
                  autoCurl: false
                });
                $("#turn_object").bind("resizestart", function() {
                  $(this).unbind("resizestart");
                  $.getScript(path, function() {
                    var unicorn = peelCornerCheck(path, fx, false);
                    unicorn();
                  });
                });
              });
            });
          },
          unbind: function() {
            // $("#target, #turn_wrapper").remove(); // doesn't always work
            // TODO: Fix this cleanly
            $("#container").siblings("div").remove(); // removes cornify divs :(
          }
        },
        dragLogo: {
          audio: "draglogo",
          run: function(path, fx) {
            // http://threedubmedia.googlecode.com/files/jquery.event.drag-2.0.min.js
            $.getScript("http://cdn.easteregg.in/triggers/drag-logo/jquery.event.drag-2.0.min.js", function() {
              var started = false;
              $('#logo').drag(function(ev, dd) {
                $(this).css({
                  top: dd.offsetY,
                  left: dd.offsetX
                });
              }, {
                // change this if you want a minimum distance for the logo to
                // be dragged before the "start" event is fired below
                distance: 0,
                // set this to false if you do not have a relative container
                relative: true
              });
              $("#logo").drag("start", function() {
                if(!started) {
                  $.getScript(path, function() {
                    var unicorn = dragLogoCheck(path, fx, false);
                    unicorn();
                  });
                }
                started = true; // TODO: clean this up
              });
            });
          },
          unbind: function() {
            $("#logo").unbind("drag");
          }
        },
        harmonyBg: {
          audio: "harmony",
          run: function(path, fx) {
            var started = false;
            $starryEgg = function() {
              if(!started) {
                var unicorn = harmonyCheck(path, fx, false);
                $.getScript(path, function() {
                  unicorn();
                });
              } else {
                started = true;
              }
            };
            $.getScript("http://cdn.easteregg.in/triggers/jquery-harmony/dollar.js", function() {
              $.getScript("http://cdn.easteregg.in/triggers/jquery-harmony/jquery-harmony.js", function() {
                var selector = $("body");
                // TODO: make the selector, color, and brush customizable based on user input
                selector.css({
                  "position": "relative",
                  "z-index": 3
                });
                selector.harmony({
                    color: [255, 255, 255] // ["#000000"] for hex values
                  , brush: 'ribbon'
                });
                $("canvas").css({
                  "cursor": "crosshair",
                  "position": "absolute",
                  "top": "0px",
                  "z-index": 2
                });
              });
            });
          },
          unbind: function() {
            $("canvas").remove();
          }
        }
      },
      // # Outcomes
      outcomes: {
        // **cornify**
        cornify: {
          audio: "cornify",
          // http://www.cornify.com/js/cornify.js
          path: "http://cdn.easteregg.in/outcomes/cornify/cornify.js",
          fx: function() {
            /*globals cornify_add */
            cornify_add();
          }
        },
        // **snowy**
        snowy: {
          audio: "snowy",
          // http://paulirish.com/js/snow.js
          path: "http://cdn.easteregg.in/outcomes/snowy/snow.min.js",
          fx: function() {
            var link = $("<link>");
            link.attr({
              rel: 'stylesheet',
              href: "http://cdn.easteregg.in/outcomes/snowy/snowy.css",
              type: 'text/css',
              media: 'screen'
            });
            $("head").append(link);
            $("body").prepend('<div id="snow_flurry"><tt>snow flurry. &lt;3</tt></div>');
          }
        },
        // **invertColors**
        invertColors: {
          audio: "invertcolors",
          path: "http://cdn.easteregg.in/outcomes/invert-colors/invert-colors.js",
          fx: function() {
            $("body").invert();
          }
        },
        // **raptorize**
        raptorize: {
          audio: "raptorize",
          // We can't use Zurb's JS file atm b/c it has local paths for media
          // Also, it does not use jPlayer so we modified its source for support
          // http://www.zurb.com/javascripts/plugins/jquery.raptorize.1.0.js
          path: "http://cdn.easteregg.in/outcomes/raptorize/jquery.raptorize.1.0.js",
          fx: function() {
            $("body").raptorize({
              delayTime: 0
            });
          }
        },
        // **katamari**
        katamari: { // TODO: Rename this to kathack globally
          audio: "kathack",
          // http://kathack.com/js/kh.js
          path: "http://cdn.easteregg.in/outcomes/kathack/kh.js",
          fx: function() {}
        },
        // **secretMsg**
        secretMsg: {
          audio: "secretmessage",
          // Can't use $.getScript here because of cache interrupt w/YUI combo
          path: "http://cdn.easteregg.in/null.min.js", // TODO: We need an override here
          fx: function() {
            $.ajax({
              type: "GET",
              url: "http://yui.yahooapis.com/combo?2.7.0/build/yahoo-dom-event/yahoo-dom-event.js&2.7.0/build/animation/animation-min.js",
              success: function() {
                // http://www.sprymedia.co.uk/secret/secret.js
                $.getScript("http://cdn.easteregg.in/outcomes/secret-msg/secret.js", function() {
                  Secret.fnMessage(msg);
                });
              },
              dataType: "script",
              cache: true
            });
          }
        },
        // **asteroids**
        asteroids: {
          audio: "asteroids",
          // http://erkie.github.com/asteroids.min.js
          path: "http://cdn.easteregg.in/outcomes/asteroids/asteroids.min.js",
          fx: function() {}
        },
        // **snake**
        snake: {
          audio: "snake",
          // http://elliottkember.com/scripts/snake3.js
          path: "http://cdn.easteregg.in/outcomes/snake/snake3.js",
          fx: function() {
            var snake = {
                  width: 20,
                  timeout: 100
                }
              , snakes = [];
            /*globals Snake*/
            snakes.push(new Snake({
              width: snake.width,
              timeout: snake.timeout
            }));
          }
        },
        // **niftylettuce
        niftylettuce: {
          audio: "nifty",
          path: "http://cdn.easteregg.in/outcomes/niftylettuce/niftylettuce.js",
          fx: function() {
            $("body").niftylettuce(); // TODO: Fix bug in IE8
          }
        },
        // **unicornPooper**
        unicornPooper: {
          audio: "unicorn-pooper",
          // http://snacksize.com/unicorn/unicorn.js?
          path: "http://cdn.easteregg.in/outcomes/unicorn-pooper/unicorn.js?",
          fx: function() {}
        },
        // **occupyInternet**
        occupyInternet: {
          audio: "occupy-internet",
          path: "http://cdn.easteregg.in/null.min.js",
          fx: function() {
            // http://occupyinter.net/embed.json?callback=_ee_occupy
            $.getScript("http://occupyinter.net/embed.json?callback=_ee_occupy");
            window._ee_occupy = function(data) {
              var finishHim = function() {
                  // http://occupyinter.net/embed.js
                  $("body").append(data.html);
                  /*globals load_protest*/
                  load_protest();
                };
              finishHim();
            };
          }
        }
      }
    },
    audioChecked = false,
    upgradeMsg = ''
      + '<div id="upgradeMsg">'
        + '<h1>To listen to our awesome audio please install '
          + '<a href="http://get.adobe.com/flashplayer/">'
            + '<img src="img/browsers/adobe-flash-player.png" alt="Adobe Flash Player" />'
          + '</a>'
        + '</h1>'
        + '<h1>'
          + 'or you can upgrade to a new browser like '
          + '<a href="http://google.com/chrome">'
            + '<img src="img/browsers/google-chrome.png" alt="Google Chrome" />'
          + '</a>'
          + ' or '
          + '<a href="http://firefox.com" target="_blank">'
            + '<img src="img/browsers/mozilla-firefox.png" alt="Mozilla Firefox" />'
          + '</a>'
          + '!'
        + '</h1>'
      + '</div>',
    nl = "\n",
    // Generated notice in all scripts
    notice = '<!-- easteregg.in - where you go to get your website\'s easter eggs -->\n',
    // Start of the script tag
    scriptTop = '<script type="text/javascript">\n(function(window, undefined){\n',
    // End of the script tag
    scriptBottom = '\n})(this);\n</script>',
    // Joins together an array with a linebreak
    lineBreaker = function (strArray) {
      return strArray.join(nl);
    },
    // # Stringalities
    stringalities = {
      triggers: {
        // **konamiCode**
        konamiCode: function(path, fx) {
          var textarea = [
                  'var konami_keys = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65],'
                , '    konami_index = 0,'
                , '    handler = function(e) {'
                , '      if(e.keyCode === konami_keys[konami_index++]) {'
                , '        if(konami_index === konami_keys.length) {'
                , '          $(document).unbind("keydown", handler);'
                , '          $.getScript("' + path + '", function() {'
              ],
              kCheck = konamiCheck(path, fx, true);
            textarea = textarea.concat(kCheck);
            textarea.push(
                '            });'
              , '          }'
              , '        } else {'
              , '          konami_index = 0;'
              , '        }'
              , '      };'
              , '      $(document).bind("keydown", handler);'
            );
          return lineBreaker(textarea);
        },
        // **doubleClickFooter**
        doubleClickFooter: function(path, fx) {
          var textarea = [
                    '$("#' + footer + '").dblclick(function() {'
                  , '  $.getScript("' + path + '", function(data, status) {'
                ]
              , dblCheck = dblClickCheck(path, fx, true);
          textarea = textarea.concat(dblCheck);
          textarea.push(
              '  });'
            , '});'
          );
          return lineBreaker(textarea);
        },
        // **typeSomething**
        typeSomething: function(path, fx) {
          var textarea = [
                  'var typeKeys = [' + something_keys + '],'
                , '    something_index = 0,'
                , '    handler = function(e) {'
                , '      if(e.keyCode === typeKeys[something_index++]){'
                , '        if(something_index === typeKeys.length){'
                , '          $(document).unbind("keydown", handler);'
                , '          $.getScript("' + path + '", function(data, status) {'
              ]
            , typeCheck = somethingCheck(path, fx, true);
          textarea = textarea.concat(typeCheck);
          textarea.push(
              '          });'
            , '        }'
            , '      } else {'
            , '        something_index = 0;'
            , '      }'
            , '    };'
            , '$(document).bind("keydown", handler);'
          );
          return lineBreaker(textarea);
        },
        // **peelCorner**
        peelCorner: function(path, fx) {
          var textarea = [
                '// http://elliottkember.com/sexy_curls.html'
              , 'var link = $("<link>");'
              , 'link.attr({'
              , '  rel: "stylesheet",'
              , '  href: "http://elliottkember.com/turn/turn.css",'
              , '  type: "text/css",'
              , '  media: "screen"'
              , '});'
              , '$("head").append(link);'
              , '// http://elliottkember.com/turn/jqueryui.js'
              , '$.getScript("http://cdn.easteregg.in/triggers/turn/jqueryui.js", function(data1, status1) {'
              , '  // http://elliottkember.com/turn/turn.js'
              , '  $.getScript("http://cdn.easteregg.in/triggers/turn/turn.js", function(data2, status2) {'
              , '    // http://elliottkember.com/turn/code.png'
              , '    $("body").prepend(\'<img id="target" src="http://cdn.easteregg.in/triggers/turn/code.png" alt="" />\');'
              , '    $("#target").fold({'
              , '      // http://elliottkember.com/turn'
              , '      directory: "http://cdn.easteregg.in/triggers/turn",'
              , '      side: "left",'
              , '      turnImage: "fold.png",'
              , '      maxHeight: 400,'
              , '      startingWidth: 40,'
              , '      startingHeight: 40,'
              , '      autoCurl: false'
              , '    });'
              , '    $("#turn_object").bind("resizestart", function() {'
              , '      $(this).unbind("resizestart");'
              , '      $.getScript("' + path + '", function(data, status) {'
            ]
            , peelCheck = peelCornerCheck(path, fx, true);
          textarea = textarea.concat(peelCheck);
          textarea.push(
              '      });'
            , '    });'
            , '  });'
            , '});'
          );
          return lineBreaker(textarea);
        },
        // **dragLogo**
        dragLogo: function(path, fx) {
          var textarea = [
                  '// http://threedubmedia.googlecode.com/files/jquery.event.drag-2.0.min.js'
                , '$.getScript("http://cdn.easteregg.in/triggers/drag-logo/jquery.event.drag-2.0.min.js", function() {'
                , '  var started = false;'
                , '  $("#logo").drag(function(ev, dd) {'
                , '    $(this).css({'
                , '      top: dd.offsetY,'
                , '      left: dd.offsetX'
                , '    });'
                , '  }, {'
                , '    // change this if you want a minimum distance for the logo to'
                , '    // be dragged before the "start" event is fired below'
                , '    distance: 0,'
                , '    // set this to false if you do not have a relative container'
                , '    relative: true'
                , '  });'
                , '  $("#logo").drag("start", function() {'
                , '    if(!started) {'
                , '      $.getScript("' + path + '", function() {'
              ]
            , dragCheck = dragLogoCheck(path, fx, true);
          textarea = textarea.concat(dragCheck);
          textarea.push(
              '      });'
            , '    }'
            , '    started = true;'
            , '  });'
            , '});'
          );
          return lineBreaker(textarea);
        },
        // **harmonyBg**
        harmonyBg: function(path, fx) {
          var textarea = [
                'var started = false;'
              , '$starryEgg = function() {'
              , '  if(!started) {'
              , '    $.getScript("' + path + '", function() {'
            ]
            , bgCheck = harmonyCheck(path, fx, true);
          textarea = textarea.concat(bgCheck);
          textarea.push(
//              '      unicorn();'
              '    });'
            , '  } else {'
            , '    started = true;'
            , '  }'
            , '};'
            , '$.getScript("http://cdn.easteregg.in/triggers/jquery-harmony/dollar.js", function() {'
            , '  $.getScript("http://cdn.easteregg.in/triggers/jquery-harmony/jquery-harmony.js", function() {'
            , '    var selector = $("body");'
            , '    selector.css({'
            , '      "position": "relative",'
            , '      "z-index": 3'
            , '    });'
            , '    selector.harmony({'
            , '        color: [255, 255, 255] // ["#000000"] for hex values'
            , '      , brush: "ribbon"'
            , '    });'
            , '    $("canvas").css({'
            , '      "cursor": "crosshair",'
            , '      "position": "absolute",'
            , '      "top": "0px",'
            , '      "z-index": 2'
            , '    });'
            , '  });'
            , '});'
          );
          return lineBreaker(textarea);
        }
      }
    };

// # Generate Copy/Paste Code
function generate(textarea) {
  // ## [JS Beautifier](https://github.com/einars/js-beautify)
  textarea = js_beautify(textarea, {
    'indent_size': 2,
    'preserve_newlines': false
  });
  $("#copyPaste")
    .text(notice + scriptTop + textarea + scriptBottom)
    .focus()
    .select();
  var eggin_keys = [67],
      eggin_index = 0,
      eggin = function(e) {
        if(e.ctrlKey === true && e.keyCode === eggin_keys[eggin_index++]) {
          if(eggin_index === eggin_keys.length) {
            $(document).unbind('keydown', eggin);
            $("#eggin").html("PASTE BEFORE THE <span>&lt;/BODY&gt;</span> TAG AND GET EGGIN'!");
          }
        } else {
          eggin_index = 0;
        }
      };
  $(document).bind('keydown', eggin);
}

// # konamiCheck
function konamiCheck(path, fx, string) {
  var output;
  if(string) {
    switch(path) {
      case fatalities.outcomes.cornify.path:
        return [
            'var finishHim = ' + fx + ';'
          , '$(document).keydown(finishHim);'
          , 'finishHim();'
        ];
      case fatalities.outcomes.secretMsg.path:
        return [
            'konami_index = 0;'
          , 'var msg = "' +  msg + '",'
          , 'finishHim = ' + fx + ';'
          , 'finishHim();'
          , '$(document).bind("keydown", handler);'
        ];
      case fatalities.outcomes.raptorize.path:
      case fatalities.outcomes.invertColors.path:
      case fatalities.outcomes.niftylettuce.path:
      case fatalities.outcomes.occupyInternet.path:
        return [
            'konami_index = 0;'
          , 'var finishHim = ' + fx + ';'
          , 'finishHim();'
          , '$(document).bind("keydown", handler);'
        ];
      case fatalities.outcomes.katamari.path:
      case fatalities.outcomes.asteroids.path:
      case fatalities.outcomes.unicornPooper.path:
        return [];
      default:
        return [
            'konami_index = 0;'
          , 'var finishHim = ' + fx + ';'
          , 'finishHim();'
        ];
    }
  } else {
    switch(path) {
      case fatalities.outcomes.cornify.path:
        return function () {
          $(document).keydown(fx);
          fx();
        };
      case fatalities.outcomes.katamari.path:
      case fatalities.outcomes.asteroids.path:
      case fatalities.outcomes.unicornPooper.path:
      case fatalities.outcomes.snake.path:
      case fatalities.outcomes.snowy.path:
        return function() {
          fx();
        };
      default:
        return function () {
          konami_keys = [];
          fx();
          fatalities.triggers.konamiCode.run(path, fx);
        };
    }
  }
}

// # dblClickCheck
function dblClickCheck(path, fx, string) {
  if(string) {
    switch(path) {
      case fatalities.outcomes.cornify.path:
        return [
            '$(this).unbind("dblclick");'
          , 'var finishHim = ' + fx + ';'
          , '$(document).keydown(finishHim);'
          , 'finishHim();'
        ];
      case fatalities.outcomes.raptorize.path:
      case fatalities.outcomes.invertColors.path:
      case fatalities.outcomes.niftylettuce.path:
      case fatalities.outcomes.occupyInternet.path:
        return [
            'var finishHim = ' + fx
          , 'finishHim();'
        ];
      case fatalities.outcomes.secretMsg.path:
        return [
            '$(this).unbind("dblclick");'
          , 'var msg = "' + msg + '";'
          , 'var finishHim = ' + fx + ';'
          , 'finishHim();'
        ];
      default:
        return [
            '$(this).unbind("dblclick");'
          , 'var finishHim = ' + fx + ';'
          , 'finishHim();'
        ];
    }
  } else {
    switch(path) {
      case fatalities.outcomes.cornify.path:
        return function () {
          $(document).keydown(fx);
          fx();
        };
      case fatalities.outcomes.snowy.path:
      case fatalities.outcomes.katamari.path:
      case fatalities.outcomes.unicornPooper.path:
      case fatalities.outcomes.snake.path:
      case fatalities.outcomes.asteroids.path:
        return function() {
          fx();
        };
      default:
        return function() {
          fx();
          fatalities.triggers.doubleClickFooter.run(path, fx);
        };
    }
  }
}

// # somethingCheck
function somethingCheck(path, fx, string) {
  var output;
  if(string) {
    switch(path) {
      case fatalities.outcomes.cornify.path:
        return [
            'var startTyping = ' + fx + ';'
          , '$(document).keydown(startTyping);'
          , 'startTyping();'
        ];
      case fatalities.outcomes.secretMsg.path:
        return [
            'something_index = 0;'
          , 'var msg = "' +  msg + '",'
          , 'startTyping = ' + fx + ';'
          , 'startTyping();'
          , '$(document).bind("keydown", handler);'
        ];
      case fatalities.outcomes.raptorize.path:
      case fatalities.outcomes.invertColors.path:
      case fatalities.outcomes.niftylettuce.path:
      case fatalities.outcomes.occupyInternet.path:
        return [
            'something_index = 0;'
          , 'var startTyping = ' + fx + ';'
          , 'startTyping();'
          , '$(document).bind("keydown", handler);'
        ];
      case fatalities.outcomes.katamari.path:
      case fatalities.outcomes.asteroids.path:
      case fatalities.outcomes.unicornPooper.path:
        return [];
      default:
        return [
            'something_index = 0;'
          , 'var startTyping = ' + fx + ';'
          , 'startTyping();'
        ];
    }
  } else {
    switch(path) {
      case fatalities.outcomes.cornify.path:
        return function () {
          $(document).keydown(fx);
          fx();
        };
      case fatalities.outcomes.katamari.path:
      case fatalities.outcomes.asteroids.path:
      case fatalities.outcomes.unicornPooper.path:
      case fatalities.outcomes.snake.path:
      case fatalities.outcomes.snowy.path:
        return function() {
          fx();
        };
      default:
        return function () {
          typeKeys = [];
          fx();
          fatalities.triggers.typeSomething.run(path, fx);
        };
    }
  }
}

// # peelCornerCheck
function peelCornerCheck(path, fx, string) {
  if(string) {
    switch(path) {
      case fatalities.outcomes.cornify.path:
        return [
            '$(document).keydown(' + fx + ');'
          , 'var finishHim = ' + fx
          , 'finishHim();'
        ];
      case fatalities.outcomes.secretMsg.path:
        return [
            'var msg = "' +  msg + '",'
          , 'finishHim = ' + fx + ';'
          , 'finishHim();'
        ];
      default:
        return [
            'var finishHim = ' + fx
          , 'finishHim();'
        ];
    }
  } else {
    switch(path) {
      case fatalities.outcomes.cornify.path:
        return function () {
          $(document).keydown(fx);
          fx();
        };
      default:
        return function() {
          fx();
        };
    }
  }
}

// # dragLogoCheck
function dragLogoCheck(path, fx, string) {
  if(string) {
    switch(path) {
      case fatalities.outcomes.cornify.path:
        return [
            '$(document).keydown(' + fx + ');'
          , 'var finishHim = ' + fx
          , 'finishHim();'
        ];
      case fatalities.outcomes.secretMsg.path:
        return [
            'var msg = "' +  msg + '",'
          , 'finishHim = ' + fx + ';'
          , 'finishHim();'
        ];
      default:
        return [
            'var finishHim = ' + fx
          , 'finishHim();'
        ];
    }
  } else {
    switch(path) {
      case fatalities.outcomes.cornify.path:
        return function () {
          $(document).keydown(fx);
          fx();
        };
      default:
        return function() {
          fx();
        };
    }
  }
}

// # harmonyCheck
function harmonyCheck(path, fx, string) {
  if(string) {
    switch(path) {
      case fatalities.outcomes.cornify.path:
        return [
            '$(document).keydown(' + fx + ');'
          , 'var finishHim = ' + fx
          , 'finishHim();'
        ];
      default:
        return [
            'var finishHim = ' + fx
          , 'finishHim();'
        ];
    }
  } else {
    switch(path) {
      case fatalities.outcomes.cornify.path:
        return function () {
          $(document).keydown(fx);
          fx();
        };
      default:
        return function() {
          fx();
        };
    }
  }
}

function newAudio(el) {
  var element = '<div id="' + el + '"></div>';
  $("body").append(element);
  $("#" + el).jPlayer({
    ready: function() {
      $("#" + el).jPlayer("setMedia", {
        mp3: "/audio/" + el + ".mp3",
        oga: "/audio/" + el + ".ogg"
      });
    },
    errorAlerts: false,
    error: function(ev) {
      if(!audioChecked) {
        audioChecked = true;
        if(ev.jPlayer.error.type === $.jPlayer.error.NO_SOLUTION) {
          $.fancybox({ content: upgradeMsg });
        }
      }
    },
    preload: "auto",
    swfPath: "/js/libs/jplayer/jquery.jplayer/",
    solution: "html, flash",
    supplied: "mp3, oga"
  });
  return $("#" + el);
}

function stopPlay(instance) {
  $(instance).jPlayer('stop').jPlayer('play');
}

function runAudio(triggerAudio, outcomeAudio) {
  $("#played").remove();
  $('<div id="played"></div>').jPlayer({
    ready: function() {
      $(this).jPlayer("setMedia", {
        mp3: "/audio/" + triggerAudio + ".mp3",
        oga: "/audio/" + triggerAudio + ".ogg"
      }).jPlayer("play");
    },
    ended: function() {
      $("#ended").remove();
      $('<div id="ended"></div>').jPlayer({
        ready: function() {
          $(this).jPlayer("setMedia", {
            mp3: "/audio/" + outcomeAudio + ".mp3",
            oga: "/audio/" + outcomeAudio + ".ogg"
          }).jPlayer("play");
        },
        preload: "auto",
        swfPath: "/js/libs/jplayer/jquery.jplayer/",
        solution: "html,flash",
        supplied: "mp3,oga"
      });
    },
    preload: "auto",
    swfPath: "/js/libs/jplayer/jquery.jplayer/",
    solution: "html,flash",
    supplied: "mp3,oga"
  });
}

$(function() {
  // ## Audio
  var ding = newAudio("ding"),
      laugh = newAudio("laugh"),
      gong = newAudio("gong"),
      feelTheWrath = newAudio("feel-the-wrath");

  $(document).keypress(function(e) {
    if(e.keyCode === 13) {
      $("#start_screen").click();
    }
  });

  // ## Animations
  $("#start_screen").live("click", function() {
    $(document).unbind("keypress");
    stopPlay(gong);
    $(this).addClass('hidden');
    $("#main").removeClass('hidden');
  });
  setInterval(function() {
    if($("#footer, #start_screen").hasClass('ir')) {
      $("#footer, #start_screen").removeClass('ir');
    } else {
      $("#footer, #start_screen").addClass('ir');
    }
  }, 500);

  // ## Click events
  $("#choose_your_trigger div, #choose_your_outcome div").live("click", function() {
    $(this).siblings("div").removeClass('selected');
    $(this).addClass('selected');
    stopPlay(ding);
  });

  $("#logo").live("click", function() {
    stopPlay(laugh);
  });

  $("#niftylettuce, #ghLink, #github-ribbon").live("click", function() {
    stopPlay(feelTheWrath);
  });

});

function checkInput() {
  $("#typeSomething input").live("keyup", function(event) {
    var ENTER = 13,
        BACKSPACE = 8,
        ALT = 18,
        SHIFT = 16,
        restricted = [ENTER, BACKSPACE, ALT, SHIFT],
        code = event.charCode || event.keyCode,
        checkRestricted = $.inArray(code, restricted),
        value = $(this).val();
    // Check how long the current value is and fix something_keys if necessary
    if(value.length !== something_keys.length) {
      something_keys = something_keys.slice(0, value.length);
    }
    // Push the key to the array
    something_keys.push(code);
    if(checkRestricted >= 0) {
      // Remove the key if it is a restricted character
      something_keys.pop();
    }
    if (code === ENTER) {
      $("#typeSomething").submit();
    }
  });
}

// Variables used for easteregg.in previews
var msg = "Example",
    footer = "footer",
    prevTrigger = "",
    txt = ''
      + '<h3 class="mortal">OR COPY/PASTE THIS TO YOUR SITE:</h3>'
      + '<textarea id="copyPaste" cols="80" rows="20"></textarea>'
      + '<h3 class="mortal" id="eggin">PRESS CTRL+C TO COPY</h4>';

// Make the credits actually function!
var livesRemaining = 7;

$(function() {
  $("#generate button").live("click", function() {
    if(livesRemaining === 0) {
      // Retro coin icon by [Sandro Pereira](http://ph03nyx.deviantart.com/)
      $.fancybox({
          content: $("#game-over")
        , modal: true
        , padding: 0
        , margin: 0
        , overlayColor: "#140D01"
        , overlayOpacity: 1.0
        , scrolling: 'no'
      });
    } else {

      livesRemaining--;
      $("#footer span").text(livesRemaining);

      var trigger = $("#choose_your_trigger div.selected").attr('title'),
          outcome = $("#choose_your_outcome div.selected").attr('title');

      // Allows user to try multiple triggers and outcomes without reloading the
      // page every time you click generate, it will simply unbind the trigger
      if(prevTrigger) fatalities.triggers[prevTrigger].unbind();

      // Set the trigger so next time we generate we can unbind the trigger
      prevTrigger = trigger;

      switch(trigger) {
        case 'konamiCode':
          switch(outcome) {
            case 'secretMsg':
              runAudio(fatalities.triggers.konamiCode.audio, fatalities.outcomes.secretMsg.audio);
              $.fancybox({
                content: ''
                  + '<form id="secretMsg">'
                  + '  <h3 class="mortal">ENTER SECRET MESSAGE!</h3>'
                  + '  <input type="text" placeholder="Enter a secret message" required autofocus />'
                  + '  <button type="submit">FINISH HIM!</button>'
                  + '</div>',
                onComplete: function() {
                  $("#secretMsg").submit(function(ev) {
                    ev.preventDefault();
                    msg = $(this).find("input").val();
                    $.fancybox({
                      content: '<h3 class="mortal">TRY: &uarr; &uarr; &darr; &darr; &larr; &rarr; &larr; &rarr; B A</h3>' + txt,
                      onComplete: function() {
                        fatalities.triggers.konamiCode.run(fatalities.outcomes.secretMsg.path, fatalities.outcomes.secretMsg.fx);
                        generate(stringalities.triggers.konamiCode(fatalities.outcomes.secretMsg.path, fatalities.outcomes.secretMsg.fx));
                      }
                    });
                  });
                }
              });
              break;
            default:
              runAudio(fatalities.triggers.konamiCode.audio, fatalities.outcomes[outcome].audio);
              $.fancybox({
                content: '<h3 class="mortal">TRY: &uarr; &uarr; &darr; &darr; &larr; &rarr; &larr; &rarr; B A</h3>' + txt,
                onComplete: function() {
                  generate(stringalities.triggers.konamiCode(fatalities.outcomes[outcome].path, fatalities.outcomes[outcome].fx));
                  fatalities.triggers.konamiCode.run(fatalities.outcomes[outcome].path, fatalities.outcomes[outcome].fx);
                }
              });
          }
          break;
        case 'doubleClickFooter':
          switch(outcome) {
            case 'secretMsg':
              runAudio(fatalities.triggers.doubleClickFooter.audio, fatalities.outcomes.secretMsg.audio);
              $.fancybox({
                content: ''
                  + '<form id="secretMsg">'
                  + '  <h3 class="mortal">ENTER SECRET MESSAGE!</h3>'
                  + '  <input type="text" placeholder="Enter a secret message" required autofocus />'
                  + '  <button type="submit">FINISH HIM!</button>'
                  + '</div>',
                onComplete: function() {
                  $("#secretMsg").submit(function(ev) {
                    ev.preventDefault();
                    msg = $(this).find("input").val();
                    $.fancybox({
                      content: '<h3 class="mortal">DOUBLE CLICK "CREDITS" IN OUR SITE\'S FOOTER!</h3>' + txt,
                      onComplete: function() {
                        generate(stringalities.triggers.doubleClickFooter(fatalities.outcomes.secretMsg.path, fatalities.outcomes.secretMsg.fx));
                        fatalities.triggers.doubleClickFooter.run(fatalities.outcomes.secretMsg.path, fatalities.outcomes.secretMsg.fx);
                      }
                    });
                  });
                }
              });
              break;
            default:
              runAudio(fatalities.triggers.doubleClickFooter.audio, fatalities.outcomes[outcome].audio);
              $.fancybox({
                content: '<h3 class="mortal">DOUBLE CLICK "CREDITS" IN OUR SITE\'S FOOTER!</h3>' + txt,
                onComplete: function() {
                  fatalities.triggers.doubleClickFooter.run(fatalities.outcomes[outcome].path, fatalities.outcomes[outcome].fx);
                  generate(stringalities.triggers.doubleClickFooter(fatalities.outcomes[outcome].path, fatalities.outcomes[outcome].fx));
                }
              });
          }
          break;
        case 'typeSomething':
          var typeInput;
          switch(outcome) {
            case 'secretMsg':
              runAudio(fatalities.triggers.typeSomething.audio, fatalities.outcomes[outcome].audio);
              $.fancybox({
                  content: ''
                    + '<form id="typeSomething">'
                    + '  <h3 class="mortal">WRITE SOMETHING!</h3>'
                    + '  <input type="text" placeholder="Write something here" required autofocus />'
                    + '  <button type="submit">FINISH HIM!</button>'
                    + '</div>',
                  onComplete: function() {
                    checkInput();
                    $("#typeSomething").submit(function(ev) {
                      ev.preventDefault();
                      typeInput = $("#typeSomething input").val();
                      $.fancybox({
                        content: ''
                          + '<form id="secretMsg">'
                          + '  <h3 class="mortal">ENTER SECRET MESSAGE!</h3>'
                          + '  <input type="text" placeholder="Enter a secret message" required autofocus />'
                          + '  <button type="submit">FINISH HIM!</button>'
                          + '</div>',
                        onComplete: function() {
                          $("#secretMsg").submit(function(ev) {
                            ev.preventDefault();
                            msg = $(this).find("input").val();
                            $.fancybox({
                              content: '<h3 class="mortal">TRY TYPING: ' + typeInput + '</h3>' + txt,
                              onComplete: function() {
                                generate(stringalities.triggers.typeSomething(fatalities.outcomes[outcome].path, fatalities.outcomes[outcome].fx));
                                fatalities.triggers.typeSomething.run(fatalities.outcomes[outcome].path, fatalities.outcomes[outcome].fx);
                              }
                            });
                          });
                        }
                      });
                    });
                  }
                });
              break;
            default:
              runAudio(fatalities.triggers.typeSomething.audio, fatalities.outcomes[outcome].audio);
              $.fancybox({
                content: ''
                  + '<form id="typeSomething">'
                  + '  <h3 class="mortal">WRITE SOMETHING!</h3>'
                  + '  <input type="text" placeholder="Write something here" required autofocus />'
                  + '  <button type="submit">FINISH HIM!</button>'
                  + '</div>',
                onComplete: function() {
                  checkInput();
                  $("#typeSomething").submit(function(ev) {
                    ev.preventDefault();
                    typeInput = $("#typeSomething input").val();
                    $.fancybox({
                      content: '<h3 class="mortal">TRY TYPING: ' + typeInput + '</h3>' + txt,
                      onComplete: function() {
                        generate(stringalities.triggers.typeSomething(fatalities.outcomes[outcome].path, fatalities.outcomes[outcome].fx));
                        fatalities.triggers.typeSomething.run(fatalities.outcomes[outcome].path, fatalities.outcomes[outcome].fx);
                      }
                    });
                  });
                }
              });
            }
            break;
        case 'peelCorner':
          switch(outcome) {
            case 'secretMsg':
              runAudio(fatalities.triggers.peelCorner.audio, fatalities.outcomes.secretMsg.audio);
              $.fancybox({
                content: ''
                  + '<form id="secretMsg">'
                  + '  <h3 class="mortal">ENTER SECRET MESSAGE!</h3>'
                  + '  <input type="text" placeholder="Enter a secret message" required autofocus />'
                  + '  <button type="submit">FINISH HIM!</button>'
                  + '</div>',
                onComplete: function() {
                  $("#secretMsg").submit(function(ev) {
                    ev.preventDefault();
                    msg = $(this).find("input").val();
                    $.fancybox({
                      content: '<h3 class="mortal">PEEL THIS SITE\'S SITE TOP LEFT CORNER!</h3>' + txt,
                      onComplete: function() {
                        generate(stringalities.triggers.peelCorner(fatalities.outcomes.secretMsg.path, fatalities.outcomes.secretMsg.fx));
                        fatalities.triggers.peelCorner.run(fatalities.outcomes.secretMsg.path, fatalities.outcomes.secretMsg.fx);
                      }
                    });
                  });
                }
              });
              break;
            default:
              runAudio(fatalities.triggers.peelCorner.audio, fatalities.outcomes[outcome].audio);
              $.fancybox({
                content: '<h3 class="mortal">PEEL THIS SITE\'S TOP LEFT CORNER!</h3>' + txt,
                onComplete: function() {
                  fatalities.triggers.peelCorner.run(fatalities.outcomes[outcome].path, fatalities.outcomes[outcome].fx);
                  generate(stringalities.triggers.peelCorner(fatalities.outcomes[outcome].path, fatalities.outcomes[outcome].fx));
                }
              });
          }
          break;
        case 'dragLogo':
          switch(outcome) {
            case 'secretMsg':
              runAudio(fatalities.triggers.dragLogo.audio, fatalities.outcomes.secretMsg.audio);
              $.fancybox({
                content: ''
                  + '<form id="secretMsg">'
                  + '  <h3 class="mortal">ENTER SECRET MESSAGE!</h3>'
                  + '  <input type="text" placeholder="Enter a secret message" required autofocus />'
                  + '  <button type="submit">FINISH HIM!</button>'
                  + '</div>',
                onComplete: function() {
                  $("#secretMsg").submit(function(ev) {
                    ev.preventDefault();
                    msg = $(this).find("input").val();
                    $.fancybox({
                      content: '<h3 class="mortal">TRY DRAGGING OUR LOGO!</h3>' + txt,
                      onComplete: function() {
                        generate(stringalities.triggers.dragLogo(fatalities.outcomes.secretMsg.path, fatalities.outcomes.secretMsg.fx));
                        fatalities.triggers.dragLogo.run(fatalities.outcomes.secretMsg.path, fatalities.outcomes.secretMsg.fx);
                      }
                    });
                  });
                }
              });
              break;
            default:
              runAudio(fatalities.triggers.dragLogo.audio, fatalities.outcomes[outcome].audio);
              $.fancybox({
                content: '<h3 class="mortal">TRY DRAGGING OUR LOGO!</h3>' + txt,
                onComplete: function() {
                  fatalities.triggers.dragLogo.run(fatalities.outcomes[outcome].path, fatalities.outcomes[outcome].fx);
                  generate(stringalities.triggers.dragLogo(fatalities.outcomes[outcome].path, fatalities.outcomes[outcome].fx));
                }
              });
          }
          break;
        case 'harmonyBg':
          runAudio(fatalities.triggers.harmonyBg.audio, fatalities.outcomes[outcome].audio);
          $.fancybox({
            content: '<h3 class="mortal">TRY DRAWING A STAR IN THE BACKGROUND!</h3>' + txt,
            onComplete: function() {
              fatalities.triggers.harmonyBg.run(fatalities.outcomes[outcome].path, fatalities.outcomes[outcome].fx);
              generate(stringalities.triggers.harmonyBg(fatalities.outcomes[outcome].path, fatalities.outcomes[outcome].fx));
            }
          });
          break;
      }
    }
  });
});
