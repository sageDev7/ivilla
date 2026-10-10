(function () {
  "use strict";
  var body = document.body;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- WhatsApp: un solo número para todos los botones ---------- */
  var WA_NUMBER = "5492984342162";
  document.querySelectorAll(".js-wa").forEach(function (a) {
    var msg = a.getAttribute("data-msg") || "Hola, quisiera hacer una consulta.";
    a.href = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg);
    a.target = "_blank";
    a.rel = "noopener";
  });

  /* ---------- boceto: páginas internas todavía no construidas ---------- */
  document.querySelectorAll("[data-soon]").forEach(function (a) {
    a.addEventListener("click", function (e) { e.preventDefault(); });
  });

  /* ---------- header ---------- */
  var hdr = document.getElementById("hdr");
  function onScroll() { hdr.classList.toggle("sc", window.scrollY > 40); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- menú mobile (la hamburguesa se transforma en cruz) ---------- */
  var burger = document.getElementById("burger");
  function setNav(open) {
    body.classList.toggle("nav-open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    burger.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  }
  burger.addEventListener("click", function () { setNav(!body.classList.contains("nav-open")); });
  document.getElementById("mnavOv").addEventListener("click", function () { setNav(false); });
  document.querySelectorAll(".mnav a").forEach(function (a) { a.addEventListener("click", function () { setNav(false); }); });

  /* ---------- servicios: pestañas ---------- */
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.svc-tabs [role="tab"]'));
  function selectTab(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener("click", function () { selectTab(t); });
    t.addEventListener("keydown", function (e) {
      var d = (e.key === "ArrowDown" || e.key === "ArrowRight") ? 1 : (e.key === "ArrowUp" || e.key === "ArrowLeft") ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      var n = tabs[(i + d + tabs.length) % tabs.length];
      selectTab(n); n.focus();
    });
  });
  /* las "puertas" del hero abren la pestaña correspondiente */
  document.querySelectorAll(".doors a[data-tab]").forEach(function (a) {
    a.addEventListener("click", function () {
      var t = document.getElementById("t-" + a.getAttribute("data-tab"));
      if (t) selectTab(t);
    });
  });

  /* ---------- reveals ---------- */
  var items = document.querySelectorAll(".reveal");
  if (reduce || !("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- WhatsApp flotante: se oculta en contacto y footer ---------- */
  var fab = document.getElementById("waFloat");
  if ("IntersectionObserver" in window) {
    var hidden = new Set();
    var fio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) hidden.add(en.target); else hidden.delete(en.target); });
      fab.classList.toggle("hide", hidden.size > 0);
    });
    fio.observe(document.getElementById("contacto"));
    fio.observe(document.getElementById("ftr"));
  }

  /* ---------- formulario (FormSubmit + modal) ---------- */
  var form = document.getElementById("contactForm"), btn = document.getElementById("formSubmitBtn");
  var iframe = document.getElementById("formsubmit-iframe"), modal = document.getElementById("okModal"), sending = false;
  function valid(input) {
    var v = input.value.trim();
    var ok = v !== "" && (input.type !== "email" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
    input.closest(".field").classList.toggle("err", !ok);
    return ok;
  }
  form.addEventListener("submit", function (e) {
    var ok = true;
    form.querySelectorAll("[required]").forEach(function (i) { if (!valid(i)) ok = false; });
    if (!ok) { e.preventDefault(); var f = form.querySelector(".field.err input,.field.err textarea"); if (f) f.focus(); return; }
    sending = true; btn.disabled = true; btn.textContent = "Enviando...";
  });
  form.querySelectorAll("[required]").forEach(function (i) {
    i.addEventListener("input", function () { if (i.closest(".field").classList.contains("err")) valid(i); });
  });
  iframe.addEventListener("load", function () {
    if (!sending) return;
    sending = false; form.reset(); btn.disabled = false; btn.textContent = "Enviar consulta";
    modal.classList.add("show");
  });
  function closeModal() { modal.classList.remove("show"); }
  modal.addEventListener("click", function (e) { if (e.target === modal || e.target.hasAttribute("data-close")) closeModal(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { setNav(false); closeModal(); } });

  document.getElementById("yr").textContent = new Date().getFullYear();
})();
