(function () {
  window.SitePlayer = {
    init: function (options) {
      var video = document.getElementById(options.videoId);
      var button = document.getElementById(options.buttonId);
      var layer = document.getElementById(options.layerId);
      var attached = false;

      if (!video || !options.source) {
        return;
      }

      function attach() {
        if (attached) {
          return;
        }

        attached = true;

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = options.source;
        } else if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(options.source);
          hls.attachMedia(video);
        } else {
          video.src = options.source;
        }
      }

      function play() {
        attach();

        if (layer) {
          layer.classList.add("is-hidden");
        }

        video.controls = true;
        var promise = video.play();

        if (promise && promise.catch) {
          promise.catch(function () {});
        }
      }

      if (button) {
        button.addEventListener("click", play);
      }

      if (layer) {
        layer.addEventListener("click", play);
      }

      video.addEventListener("click", function () {
        if (video.paused) {
          play();
        }
      });

      video.addEventListener("play", function () {
        if (layer) {
          layer.classList.add("is-hidden");
        }
      });
    }
  };
})();
