(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function setupMenu() {
        var header = document.querySelector(".site-header");
        var button = document.querySelector(".menu-toggle");
        if (!header || !button) {
            return;
        }
        button.addEventListener("click", function () {
            header.classList.toggle("menu-open");
        });
    }

    function setupHero() {
        var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
        if (!slides.length) {
            return;
        }
        var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
        var next = document.querySelector("[data-hero-next]");
        var prev = document.querySelector("[data-hero-prev]");
        var active = 0;
        var timer = null;

        function show(index) {
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

        if (next) {
            next.addEventListener("click", function () {
                show(active + 1);
                start();
            });
        }

        if (prev) {
            prev.addEventListener("click", function () {
                show(active - 1);
                start();
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener("click", function () {
                show(index);
                start();
            });
        });

        start();
    }

    function setupSearch() {
        var input = document.getElementById("movieSearchInput");
        var category = document.getElementById("movieCategoryFilter");
        var region = document.getElementById("movieRegionFilter");
        var year = document.getElementById("movieYearFilter");
        var cards = Array.prototype.slice.call(document.querySelectorAll(".search-results .movie-card"));
        if (!input || !cards.length) {
            return;
        }

        var params = new URLSearchParams(window.location.search);
        var query = params.get("q") || "";
        input.value = query;

        function valueOf(element) {
            return element ? element.value.trim().toLowerCase() : "";
        }

        function update() {
            var keyword = valueOf(input);
            var selectedCategory = valueOf(category);
            var selectedRegion = valueOf(region);
            var selectedYear = valueOf(year);

            cards.forEach(function (card) {
                var text = (card.getAttribute("data-search") || "").toLowerCase();
                var cardCategory = (card.getAttribute("data-category") || "").toLowerCase();
                var cardRegion = (card.getAttribute("data-region") || "").toLowerCase();
                var cardYear = (card.getAttribute("data-year") || "").toLowerCase();
                var matched = true;

                if (keyword && text.indexOf(keyword) === -1) {
                    matched = false;
                }
                if (selectedCategory && cardCategory !== selectedCategory) {
                    matched = false;
                }
                if (selectedRegion && cardRegion !== selectedRegion) {
                    matched = false;
                }
                if (selectedYear && cardYear !== selectedYear) {
                    matched = false;
                }

                card.classList.toggle("is-filtered-out", !matched);
            });
        }

        [input, category, region, year].forEach(function (control) {
            if (control) {
                control.addEventListener("input", update);
                control.addEventListener("change", update);
            }
        });

        update();
    }

    ready(function () {
        setupMenu();
        setupHero();
        setupSearch();
    });
})();
