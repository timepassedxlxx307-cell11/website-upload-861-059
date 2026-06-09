(function () {
    function all(selector, parent) {
        return Array.prototype.slice.call((parent || document).querySelectorAll(selector));
    }

    function one(selector, parent) {
        return (parent || document).querySelector(selector);
    }

    function normalize(value) {
        return (value || "").toString().trim().toLowerCase();
    }

    function setupNavigation() {
        var toggle = one("[data-nav-toggle]");
        var menu = one("[data-mobile-nav]");
        if (!toggle || !menu) {
            return;
        }

        toggle.addEventListener("click", function () {
            menu.classList.toggle("is-open");
        });
    }

    function setupHero() {
        var slides = all("[data-hero-slide]");
        var dots = all("[data-hero-dot]");
        if (slides.length === 0) {
            return;
        }

        var index = 0;
        var timer = null;

        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
            });
        }

        function start() {
            timer = window.setInterval(function () {
                show(index + 1);
            }, 5200);
        }

        dots.forEach(function (dot, dotIndex) {
            dot.addEventListener("click", function () {
                if (timer) {
                    window.clearInterval(timer);
                }
                show(dotIndex);
                start();
            });
        });

        show(0);
        if (slides.length > 1) {
            start();
        }
    }

    function setupFiltering() {
        var groups = all("[data-list-tools]");
        groups.forEach(function (group) {
            var scopeId = group.getAttribute("data-list-tools");
            var list = one('[data-list="' + scopeId + '"]');
            if (!list) {
                return;
            }

            var cards = all("[data-movie-card]", list);
            var search = one("[data-card-search]", group);
            var year = one("[data-year-filter]", group);
            var region = one("[data-region-filter]", group);
            var empty = one('[data-empty="' + scopeId + '"]');

            function apply() {
                var keyword = normalize(search && search.value);
                var yearValue = normalize(year && year.value);
                var regionValue = normalize(region && region.value);
                var visible = 0;

                cards.forEach(function (card) {
                    var text = normalize([
                        card.getAttribute("data-title"),
                        card.getAttribute("data-genre"),
                        card.getAttribute("data-tags"),
                        card.getAttribute("data-region")
                    ].join(" "));
                    var cardYear = normalize(card.getAttribute("data-year"));
                    var cardRegion = normalize(card.getAttribute("data-region"));

                    var matched = true;
                    if (keyword && text.indexOf(keyword) === -1) {
                        matched = false;
                    }
                    if (yearValue && cardYear !== yearValue) {
                        matched = false;
                    }
                    if (regionValue && cardRegion.indexOf(regionValue) === -1) {
                        matched = false;
                    }

                    card.style.display = matched ? "" : "none";
                    if (matched) {
                        visible += 1;
                    }
                });

                if (empty) {
                    empty.classList.toggle("is-visible", visible === 0);
                }
            }

            [search, year, region].forEach(function (control) {
                if (control) {
                    control.addEventListener("input", apply);
                    control.addEventListener("change", apply);
                }
            });

            apply();
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        setupNavigation();
        setupHero();
        setupFiltering();
    });
})();
