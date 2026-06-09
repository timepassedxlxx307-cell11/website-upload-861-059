(function () {
    function setMessage(shell, text) {
        var message = shell.querySelector('[data-player-message]');

        if (message) {
            message.textContent = text || '';
        }
    }

    function attachSource(shell) {
        var video = shell.querySelector('video');
        var source = shell.getAttribute('data-video-url');

        if (!video || !source) {
            setMessage(shell, '视频地址不可用。');
            return;
        }

        function tryPlay() {
            var playPromise = video.play();

            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {
                    setMessage(shell, '请再次点击播放器开始播放。');
                });
            }
        }

        if (video.getAttribute('data-source-attached') === 'true') {
            shell.classList.add('is-playing');
            tryPlay();
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: false
            });

            hls.loadSource(source);
            hls.attachMedia(video);
            video.hlsInstance = hls;

            hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                video.setAttribute('data-source-attached', 'true');
                shell.classList.add('is-playing');
                setMessage(shell, '');
                tryPlay();
            });

            hls.on(window.Hls.Events.ERROR, function (eventName, data) {
                if (data && data.fatal) {
                    setMessage(shell, '视频暂时无法播放，请稍后重试。');
                }
            });
        } else {
            video.src = source;
            video.setAttribute('data-source-attached', 'true');
            shell.classList.add('is-playing');
            setMessage(shell, '');
            tryPlay();
        }
    }

    document.querySelectorAll('[data-video-url]').forEach(function (shell) {
        var button = shell.querySelector('.play-overlay');
        var video = shell.querySelector('video');

        if (button) {
            button.addEventListener('click', function () {
                attachSource(shell);
            });
        }

        if (video) {
            video.addEventListener('play', function () {
                shell.classList.add('is-playing');
            });

            video.addEventListener('click', function () {
                if (video.getAttribute('data-source-attached') !== 'true') {
                    attachSource(shell);
                }
            });
        }
    });
})();
