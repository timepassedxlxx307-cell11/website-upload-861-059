(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobilePanel = document.querySelector('[data-mobile-panel]');

    if (menuButton && mobilePanel) {
        menuButton.addEventListener('click', function () {
            mobilePanel.classList.toggle('is-open');
        });
    }

    var slider = document.querySelector('[data-hero-slider]');

    if (slider) {
        var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(slider.querySelectorAll('.hero-dot'));
        var activeIndex = 0;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }

            activeIndex = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === activeIndex);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === activeIndex);
            });
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener('click', function () {
                showSlide(dotIndex);
            });
        });

        window.setInterval(function () {
            showSlide(activeIndex + 1);
        }, 5200);
    }

    var searchPage = document.querySelector('[data-search-page]');

    if (searchPage) {
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get('q') || '';
        var input = searchPage.querySelector('[data-search-input]');
        var select = searchPage.querySelector('[data-category-filter]');
        var cards = Array.prototype.slice.call(searchPage.querySelectorAll('[data-title]'));
        var empty = searchPage.querySelector('[data-empty]');

        if (input) {
            input.value = initialQuery;
        }

        function normalize(value) {
            return String(value || '').toLowerCase().trim();
        }

        function applyFilters() {
            var query = normalize(input ? input.value : '');
            var category = select ? select.value : '';
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-tags'),
                    card.getAttribute('data-category'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-region')
                ].join(' '));
                var sameCategory = !category || card.getAttribute('data-category') === category;
                var matched = sameCategory && (!query || haystack.indexOf(query) !== -1);

                card.style.display = matched ? '' : 'none';

                if (matched) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle('is-visible', visible === 0);
            }
        }

        if (input) {
            input.addEventListener('input', applyFilters);
        }

        if (select) {
            select.addEventListener('change', applyFilters);
        }

        applyFilters();
    }

    function activatePlayer(player) {
        var video = player.querySelector('video');
        var overlay = player.querySelector('.player-overlay');
        var url = player.getAttribute('data-video-url');

        if (!video || !url) {
            return;
        }

        if (!player.getAttribute('data-ready')) {
            player.setAttribute('data-ready', 'true');

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = url;
            } else if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                hls.loadSource(url);
                hls.attachMedia(video);
                player.hlsInstance = hls;
            } else {
                video.src = url;
            }
        }

        player.classList.add('is-playing');

        if (overlay) {
            overlay.setAttribute('hidden', 'hidden');
        }

        video.controls = true;

        var attempt = video.play();

        if (attempt && typeof attempt.catch === 'function') {
            attempt.catch(function () {
                video.controls = true;
            });
        }
    }

    var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

    players.forEach(function (player) {
        var overlay = player.querySelector('.player-overlay');
        var video = player.querySelector('video');

        if (overlay) {
            overlay.addEventListener('click', function (event) {
                event.preventDefault();
                activatePlayer(player);
            });
        }

        if (video) {
            video.addEventListener('click', function () {
                if (video.paused) {
                    activatePlayer(player);
                }
            });
        }
    });
}());
