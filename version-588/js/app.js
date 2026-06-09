(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileNav = document.querySelector('[data-mobile-nav]');

    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    var heroSlides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var heroDots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
    var heroIndex = 0;

    function showHeroSlide(index) {
        if (!heroSlides.length) {
            return;
        }

        heroIndex = (index + heroSlides.length) % heroSlides.length;

        heroSlides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('is-active', slideIndex === heroIndex);
        });

        heroDots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('is-active', dotIndex === heroIndex);
        });
    }

    heroDots.forEach(function (dot) {
        dot.addEventListener('click', function () {
            var nextIndex = Number(dot.getAttribute('data-hero-dot') || '0');
            showHeroSlide(nextIndex);
        });
    });

    if (heroSlides.length > 1) {
        window.setInterval(function () {
            showHeroSlide(heroIndex + 1);
        }, 5600);
    }

    function normalize(value) {
        return String(value || '').trim().toLowerCase();
    }

    function applyFilters(scope) {
        var keywordInput = scope.querySelector('[data-filter-keyword]');
        var yearSelect = scope.querySelector('[data-filter-year]');
        var regionSelect = scope.querySelector('[data-filter-region]');
        var typeSelect = scope.querySelector('[data-filter-type]');
        var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-search-card]'));
        var emptyState = scope.querySelector('[data-empty-state]');
        var keyword = normalize(keywordInput && keywordInput.value);
        var year = normalize(yearSelect && yearSelect.value);
        var region = normalize(regionSelect && regionSelect.value);
        var type = normalize(typeSelect && typeSelect.value);
        var visibleCount = 0;

        cards.forEach(function (card) {
            var text = normalize(card.getAttribute('data-search-text'));
            var cardYear = normalize(card.getAttribute('data-year'));
            var cardRegion = normalize(card.getAttribute('data-region'));
            var cardType = normalize(card.getAttribute('data-type'));
            var matched = true;

            if (keyword && text.indexOf(keyword) === -1) {
                matched = false;
            }

            if (year && cardYear !== year) {
                matched = false;
            }

            if (region && cardRegion !== region) {
                matched = false;
            }

            if (type && cardType !== type) {
                matched = false;
            }

            card.hidden = !matched;

            if (matched) {
                visibleCount += 1;
            }
        });

        if (emptyState) {
            emptyState.hidden = visibleCount !== 0;
        }
    }

    document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
        var keywordInput = scope.querySelector('[data-filter-keyword]');
        var controls = Array.prototype.slice.call(scope.querySelectorAll('[data-filter-keyword], [data-filter-year], [data-filter-region], [data-filter-type]'));

        if (scope.getAttribute('data-read-query') === 'true' && keywordInput) {
            var params = new URLSearchParams(window.location.search);
            var query = params.get('q');

            if (query) {
                keywordInput.value = query;
            }
        }

        controls.forEach(function (control) {
            control.addEventListener('input', function () {
                applyFilters(scope);
            });

            control.addEventListener('change', function () {
                applyFilters(scope);
            });
        });

        applyFilters(scope);
    });
})();
