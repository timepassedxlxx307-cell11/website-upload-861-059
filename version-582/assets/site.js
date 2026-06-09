(function () {
    function selectAll(selector, root) {
        return Array.prototype.slice.call((root || document).querySelectorAll(selector));
    }

    function bindMobileNav() {
        var button = document.querySelector("[data-menu-button]");
        var menu = document.querySelector("[data-mobile-nav]");
        if (!button || !menu) {
            return;
        }
        button.addEventListener("click", function () {
            menu.classList.toggle("is-open");
        });
    }

    function bindHero() {
        var hero = document.querySelector("[data-hero]");
        if (!hero) {
            return;
        }
        var slides = selectAll("[data-hero-slide]", hero);
        var dots = selectAll("[data-hero-dot]", hero);
        var previous = hero.querySelector("[data-hero-prev]");
        var next = hero.querySelector("[data-hero-next]");
        var active = 0;
        var timer = null;

        function show(index) {
            if (!slides.length) {
                return;
            }
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === active);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === active);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(active + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                show(Number(dot.getAttribute("data-hero-dot")) || 0);
                start();
            });
        });

        if (previous) {
            previous.addEventListener("click", function () {
                show(active - 1);
                start();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                show(active + 1);
                start();
            });
        }

        hero.addEventListener("mouseenter", stop);
        hero.addEventListener("mouseleave", start);
        show(0);
        start();
    }

    function bindFilters() {
        var list = document.querySelector("[data-filter-list]");
        if (!list) {
            return;
        }
        var cards = selectAll("[data-movie-card]", list);
        var empty = document.querySelector("[data-empty-state]");
        var fields = {
            q: document.getElementById("page-search"),
            genre: document.getElementById("filter-genre"),
            year: document.getElementById("filter-year"),
            region: document.getElementById("filter-region"),
            type: document.getElementById("filter-type")
        };

        function apply() {
            var q = fields.q ? fields.q.value.trim().toLowerCase() : "";
            var genre = fields.genre ? fields.genre.value.trim().toLowerCase() : "";
            var year = fields.year ? fields.year.value.trim().toLowerCase() : "";
            var region = fields.region ? fields.region.value.trim().toLowerCase() : "";
            var type = fields.type ? fields.type.value.trim().toLowerCase() : "";
            var shown = 0;

            cards.forEach(function (card) {
                var haystack = [
                    card.getAttribute("data-title"),
                    card.getAttribute("data-region"),
                    card.getAttribute("data-type"),
                    card.getAttribute("data-year"),
                    card.getAttribute("data-genre"),
                    card.textContent
                ].join(" ").toLowerCase();
                var matched = true;
                if (q && haystack.indexOf(q) === -1) {
                    matched = false;
                }
                if (genre && haystack.indexOf(genre) === -1) {
                    matched = false;
                }
                if (year && String(card.getAttribute("data-year") || "").toLowerCase() !== year) {
                    matched = false;
                }
                if (region && String(card.getAttribute("data-region") || "").toLowerCase() !== region) {
                    matched = false;
                }
                if (type && String(card.getAttribute("data-type") || "").toLowerCase() !== type) {
                    matched = false;
                }
                card.hidden = !matched;
                if (matched) {
                    shown += 1;
                }
            });

            if (empty) {
                empty.hidden = shown !== 0;
            }
        }

        Object.keys(fields).forEach(function (key) {
            var field = fields[key];
            if (field) {
                field.addEventListener("input", apply);
                field.addEventListener("change", apply);
            }
        });

        var params = new URLSearchParams(window.location.search);
        Object.keys(fields).forEach(function (key) {
            var field = fields[key];
            if (field && params.has(key)) {
                field.value = params.get(key) || "";
            }
        });

        apply();
    }

    window.MoviePlayer = {
        create: function (options) {
            var video = document.getElementById(options.videoId);
            var overlay = document.getElementById(options.overlayId);
            var prepared = false;
            var hlsInstance = null;

            if (!video || !overlay || !options.source) {
                return;
            }

            function prepare() {
                if (prepared) {
                    return;
                }
                prepared = true;
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = options.source;
                    return;
                }
                if (window.Hls && window.Hls.isSupported()) {
                    hlsInstance = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hlsInstance.loadSource(options.source);
                    hlsInstance.attachMedia(video);
                    return;
                }
                video.src = options.source;
            }

            function start() {
                prepare();
                overlay.classList.add("is-hidden");
                video.controls = true;
                var request = video.play();
                if (request && typeof request.catch === "function") {
                    request.catch(function () {
                        overlay.classList.remove("is-hidden");
                    });
                }
            }

            overlay.addEventListener("click", start);
            video.addEventListener("click", function () {
                if (!prepared || video.paused) {
                    start();
                }
            });
            video.addEventListener("play", function () {
                overlay.classList.add("is-hidden");
            });
            video.addEventListener("pause", function () {
                if (video.currentTime === 0 || video.ended) {
                    overlay.classList.remove("is-hidden");
                }
            });
            video.addEventListener("ended", function () {
                overlay.classList.remove("is-hidden");
            });
            window.addEventListener("beforeunload", function () {
                if (hlsInstance && typeof hlsInstance.destroy === "function") {
                    hlsInstance.destroy();
                }
            });
        }
    };

    document.addEventListener("DOMContentLoaded", function () {
        bindMobileNav();
        bindHero();
        bindFilters();
    });
})();
