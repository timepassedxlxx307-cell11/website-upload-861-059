(function () {
  var toggle = document.querySelector('[data-nav-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var slider = document.querySelector('[data-hero-slider]');

  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var timer = null;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function startTimer() {
      if (timer) {
        clearInterval(timer);
      }
      timer = setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
        startTimer();
      });
    });

    if (slides.length > 1) {
      startTimer();
    }
  }

  var filterInput = document.querySelector('[data-card-filter]');
  var filterList = document.querySelector('[data-filter-list]');
  var emptyState = document.querySelector('[data-empty-state]');

  if (filterInput && filterList) {
    var cards = Array.prototype.slice.call(filterList.querySelectorAll('[data-card]'));

    filterInput.addEventListener('input', function () {
      var keyword = filterInput.value.trim().toLowerCase();
      var visible = 0;

      cards.forEach(function (card) {
        var text = [
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-year'),
          card.getAttribute('data-type')
        ].join(' ').toLowerCase();
        var match = !keyword || text.indexOf(keyword) !== -1;
        card.style.display = match ? '' : 'none';
        if (match) {
          visible += 1;
        }
      });

      if (emptyState) {
        emptyState.classList.toggle('is-visible', visible === 0);
      }
    });
  }

  var searchPage = document.querySelector('[data-search-page]');

  if (searchPage && window.SITE_MOVIES) {
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';
    var input = searchPage.querySelector('[data-search-input]');
    var summary = searchPage.querySelector('[data-search-summary]');
    var results = searchPage.querySelector('[data-search-results]');

    if (input) {
      input.value = query;
    }

    function render(items, keyword) {
      if (!results) {
        return;
      }

      results.innerHTML = items.map(function (item) {
        return [
          '<a class="movie-card" href="./' + item.file + '">',
          '<div class="poster-wrap">',
          '<img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '" loading="lazy">',
          '<div class="poster-badge"><span>' + escapeHtml(item.year || '') + '</span></div>',
          '</div>',
          '<div class="card-body">',
          '<div class="card-meta"><span>' + escapeHtml(item.region) + '</span><span>' + escapeHtml(item.type) + '</span></div>',
          '<h3>' + escapeHtml(item.title) + '</h3>',
          '<p>' + escapeHtml(item.description) + '</p>',
          '<div class="tag-row"><span>' + escapeHtml(item.genre) + '</span></div>',
          '</div>',
          '</a>'
        ].join('');
      }).join('');

      if (summary) {
        summary.textContent = keyword ? '与“' + keyword + '”相关的内容' : '热门推荐内容';
      }
    }

    function escapeHtml(value) {
      return String(value || '').replace(/[&<>"]/g, function (char) {
        return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;'
        }[char];
      });
    }

    if (query) {
      var keyword = query.trim().toLowerCase();
      var matched = window.SITE_MOVIES.filter(function (item) {
        return [item.title, item.region, item.type, item.year, item.genre, item.tags, item.description]
          .join(' ')
          .toLowerCase()
          .indexOf(keyword) !== -1;
      }).slice(0, 120);
      render(matched, query);
    }
  }
}());
