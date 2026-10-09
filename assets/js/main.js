/* Sarim Siddiqui portfolio — lightweight interactions.
   No frameworks. All motion respects prefers-reduced-motion. */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Mobile menu */
  var burger = document.querySelector(".burger");
  var navLinks = document.querySelector(".nav-links");
  var nav = document.querySelector(".nav");
  if (burger && navLinks) {
    burger.addEventListener("click", function () {
      var open = navLinks.classList.toggle("open");
      nav.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navLinks.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navLinks.classList.remove("open");
        nav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Scroll reveal */
  var rvEls = document.querySelectorAll(".rv");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    rvEls.forEach(function (el) { io.observe(el); });
  } else {
    rvEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* Playful cursor dot (desktop only) */
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (fine && !reduce) {
    var dot = document.createElement("div");
    dot.className = "cursor-dot";
    dot.setAttribute("aria-hidden", "true");
    document.body.appendChild(dot);
    var x = 0, y = 0, tx = 0, ty = 0, shown = false;
    document.addEventListener("mousemove", function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!shown) { dot.classList.add("on"); shown = true; }
    });
    document.addEventListener("mouseleave", function () {
      dot.classList.remove("on"); shown = false;
    });
    (function follow() {
      x += (tx - x) * 0.2; y += (ty - y) * 0.2;
      dot.style.transform = "translate(" + x + "px," + y + "px) translate(-50%,-50%)";
      requestAnimationFrame(follow);
    })();
    document.querySelectorAll("a, button, .btn").forEach(function (el) {
      el.addEventListener("mouseenter", function () { dot.classList.add("grow"); });
      el.addEventListener("mouseleave", function () { dot.classList.remove("grow"); });
    });
  }

  /* Copy email button */
  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.getAttribute("data-copy");
      function done() {
        var old = btn.textContent;
        btn.textContent = "Copied";
        setTimeout(function () { btn.textContent = old; }, 1600);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(done);
      } else {
        var ta = document.createElement("textarea");
        ta.value = text; document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); } catch (e) {}
        document.body.removeChild(ta); done();
      }
    });
  });

  /* Contact form -> reviewable email draft (no backend on a static site) */
  var form = document.getElementById("contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true;
      form.querySelectorAll("[data-required]").forEach(function (input) {
        var field = input.closest(".field");
        var val = input.value.trim();
        var valid = val.length > 0;
        if (valid && input.type === "email") {
          valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        }
        field.classList.toggle("invalid", !valid);
        if (!valid) ok = false;
      });
      if (!ok) return;
      var name = form.querySelector("#f-name").value.trim();
      var email = form.querySelector("#f-email").value.trim();
      var site = form.querySelector("#f-site").value.trim();
      var msg = form.querySelector("#f-msg").value.trim();
      var subject = encodeURIComponent("Project enquiry from " + name);
      var body = encodeURIComponent(
        "Name: " + name + "\nEmail: " + email + "\nWebsite: " + (site || "-") + "\n\n" + msg
      );
      document.getElementById("form-success").classList.add("show");
      document.getElementById("draft-link").href =
        "mailto:Sarimsiddiqui900@gmail.com?subject=" + subject + "&body=" + body;
      form.querySelector("button[type=submit]").textContent = "Draft ready below";
    });
    form.querySelectorAll("input, textarea").forEach(function (input) {
      input.addEventListener("input", function () {
        input.closest(".field").classList.remove("invalid");
      });
    });
  }

  /* Back to top */
  var toTop = document.querySelector(".to-top");
  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
  }

  /* Footer year */
  var yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();
})();
