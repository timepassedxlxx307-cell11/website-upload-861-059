(function () {
  function ready(callback) {
    if (document.readyState !== "loading") {
      callback();
    } else {
      document.addEventListener("DOMContentLoaded", callback);
    }
  }

  ready(function () {
    var toggle = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-mobile-menu]");

    if (toggle && menu) {
      toggle.addEventListener("click", function () {
        menu.classList.toggle("is-open");
      });
    }

    var slider = document.querySelector("[data-hero-slider]");

    if (slider) {
      var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
      var prev = slider.querySelector("[data-hero-prev]");
      var next = slider.querySelector("[data-hero-next]");
      var current = 0;
      var timer;

      function show(index) {
        if (!slides.length) {
          return;
        }

        current = (index + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === current);
        });

        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === current);
        });
      }

      function start() {
        stop();
        timer = window.setInterval(function () {
          show(current + 1);
        }, 5200);
      }

      function stop() {
        if (timer) {
          window.clearInterval(timer);
        }
      }

      dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
          show(index);
          start();
        });
      });

      if (prev) {
        prev.addEventListener("click", function () {
          show(current - 1);
          start();
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          show(current + 1);
          start();
        });
      }

      slider.addEventListener("mouseenter", stop);
      slider.addEventListener("mouseleave", start);
      show(0);
      start();
    }

    var searchPage = document.querySelector("[data-search-page]");

    if (searchPage) {
      var input = searchPage.querySelector("#searchInput");
      var cards = Array.prototype.slice.call(searchPage.querySelectorAll(".search-movie"));
      var status = searchPage.querySelector("[data-search-status]");
      var params = new URLSearchParams(window.location.search);
      var query = params.get("q") || "";

      if (input) {
        input.value = query;
      }

      function applySearch(value) {
        var words = value.trim().toLowerCase().split(/\s+/).filter(Boolean);
        var visible = 0;

        cards.forEach(function (card) {
          var index = card.getAttribute("data-index") || "";
          var matched = !words.length || words.every(function (word) {
            return index.indexOf(word) !== -1;
          });

          card.style.display = matched ? "" : "none";

          if (matched) {
            visible += 1;
          }
        });

        if (status) {
          status.textContent = words.length ? "找到 " + visible + " 部相关作品" : "输入关键词开始筛选";
        }
      }

      applySearch(query);

      if (input) {
        input.addEventListener("input", function () {
          applySearch(input.value);
        });
      }
    }
  });
})();
