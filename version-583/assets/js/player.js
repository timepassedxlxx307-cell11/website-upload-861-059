(function () {
    function readyPlayer(root) {
        var video = root.querySelector("[data-player-video]");
        var cover = root.querySelector("[data-player-cover]");
        var message = root.querySelector("[data-player-message]");
        var stream = video ? video.getAttribute("data-stream") : "";

        if (!video || !cover || !stream) {
            return;
        }

        function showMessage(text) {
            if (!message) {
                return;
            }
            message.textContent = text;
            message.classList.add("is-visible");
        }

        function playVideo() {
            var request = video.play();
            if (request && typeof request.catch === "function") {
                request.catch(function () {
                    showMessage("点击播放器即可继续观看。");
                });
            }
        }

        function attachStream() {
            if (video.getAttribute("data-ready") === "yes") {
                playVideo();
                return;
            }

            cover.classList.add("is-hidden");
            video.setAttribute("controls", "controls");

            if (video.canPlayType("application/vnd.apple.mpegurl") || video.canPlayType("application/x-mpegURL")) {
                video.src = stream;
                video.setAttribute("data-ready", "yes");
                video.addEventListener("loadedmetadata", playVideo, { once: true });
                video.load();
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(stream);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    video.setAttribute("data-ready", "yes");
                    playVideo();
                });
                hls.on(window.Hls.Events.ERROR, function (event, data) {
                    if (data && data.fatal) {
                        showMessage("播放暂不可用，请稍后再试。");
                    }
                });
                return;
            }

            showMessage("播放暂不可用，请稍后再试。");
        }

        cover.addEventListener("click", attachStream);
        video.addEventListener("click", function () {
            if (video.paused) {
                attachStream();
            }
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        Array.prototype.slice.call(document.querySelectorAll("[data-player]")).forEach(readyPlayer);
    });
})();
