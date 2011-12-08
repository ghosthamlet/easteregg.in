/*
 * jQuery Raptorize Plugin 1.0
 * www.ZURB.com/playground
 * Copyright 2010, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
*/

// Modified for http://easteregg.in raptorize with audio fix

(function($) {
  $.fn.raptorize = function(options) {
    var defaults = {
      delayTime: 5000
    };
    options = $.extend(defaults, options);
    return this.each(function() {
      var _this = $(this);
      $.getScript("/js/libs/jplayer/jquery.jplayer/jquery.jplayer.js", function() {
        var raptorImg = $('<img id="elRaptor" style="display: none" src="http://www.zurb.com/playground/raptorize/raptor.png" />'),
            raptorAudio = function() {
                $('#raptorAudio').remove();
                $('<div id="raptorAudio"></div>').jPlayer({
                  ready: function () {
                    $(this).jPlayer("setMedia", {
                      mp3: "http://prod.zurb.com.s3.amazonaws.com/raptor-sound.mp3",
                      oga: "http://prod.zurb.com.s3.amazonaws.com/raptor-sound.ogg"
                    }).jPlayer("play");
                  },
                  errorAlerts: false,
                  warningAlerts: false,
                  preload: "auto",
                  swfPath: "http://cdn.easteregg.in/js/libs/jplayer/jquery.jplayer/",
                  solution: "html, flash",
                  supplied: "mp3, oga"
                });
              },
            raptor = raptorImg.css({
              "position":"fixed",
              "bottom": "-700px",
              "right" : "0",
              "display" : "block"
            });
        $('body').append(raptorImg);
        function init() {
          raptorAudio();
          raptor.animate({
            "bottom": "0"
          }, function() {
            $(this).animate({
              "bottom": "-130px"
            }, 100, function() {
              var offset = (($(this).position().left)+400);
              $(this).delay(300).animate({
                "right" : offset
              }, 2200, function() {
                raptor = raptorImg.css({
                  "bottom": "-700px",
                  "right" : "0"
                });
              });
            });
          });
        }
        setTimeout(init, options.delayTime);
      });
    });
  };
}(jQuery));
