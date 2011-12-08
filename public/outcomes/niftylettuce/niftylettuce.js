/*
 * jQuery Raptorize Plugin 1.0
 * www.ZURB.com/playground
 * Copyright 2010, ZURB
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
*/

// Modified for http://easteregg.in nifty egg

(function($) {
  $.fn.niftylettuce = function() {
    return this.each(function() {
      var _this = $(this);
      $.getScript("/js/libs/jplayer/jquery.jplayer/jquery.jplayer.js", function() {
        var niftylettuceImg = $('<img id="elNiftylettuce" style="display: none" src="http://cdn.easteregg.in/outcomes/niftylettuce/niftylettuce.png" />'),
            niftylettuceAudio = function() {
                $('#niftylettuceAudio').remove();
                $('<div id="niftylettuceAudio"></div>').jPlayer({
                  ready: function () {
                    $(this).jPlayer("setMedia", {
                      mp3: "http://cdn.easteregg.in/outcomes/niftylettuce/niftylettuce-sound.mp3",
                      oga: "http://cdn.easteregg.in/outcomes/niftylettuce/niftylettuce-sound.ogg"
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
            niftylettuce = niftylettuceImg.css({
              "position":"fixed",
              "bottom": "0",
              "right" : "-332px",
              "display" : "block"
            });
        $('body').append(niftylettuceImg);
        function init() {
          niftylettuceAudio();
          niftylettuce.animate({
            "right": "25"
          }, 300, function() {
            $(this).delay(600).animate({
              "right": "-332px"
            });
          });
        }
        init();
      });
    });
  };
}(jQuery));
