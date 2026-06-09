(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function setupPlayers() {
        var players = Array.prototype.slice.call(document.querySelectorAll(".movie-player"));
        players.forEach(function (box) {
            var video = box.querySelector("video");
            var button = box.querySelector(".play-layer");
            var stream = box.getAttribute("data-stream");
            var prepared = false;
            var hls = null;

            if (!video || !button || !stream) {
                return;
            }

            function playVideo() {
                var task = video.play();
                if (task && typeof task.catch === "function") {
                    task.catch(function () {});
                }
            }

            function prepare() {
                if (prepared) {
                    playVideo();
                    return;
                }

                prepared = true;
                button.classList.add("is-hidden");
                video.setAttribute("controls", "controls");

                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = stream;
                    video.addEventListener("loadedmetadata", playVideo, { once: true });
                    playVideo();
                    return;
                }

                if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({ enableWorker: true });
                    hls.loadSource(stream);
                    hls.attachMedia(video);
                    hls.on(window.Hls.Events.MANIFEST_PARSED, playVideo);
                    return;
                }

                video.src = stream;
                video.addEventListener("loadedmetadata", playVideo, { once: true });
                playVideo();
            }

            button.addEventListener("click", prepare);
            video.addEventListener("click", function () {
                if (!prepared) {
                    prepare();
                }
            });
            window.addEventListener("beforeunload", function () {
                if (hls) {
                    hls.destroy();
                }
            });
        });
    }

    ready(setupPlayers);
})();
