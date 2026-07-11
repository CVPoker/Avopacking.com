/* ====== AvoPack — interacción ====== */

// Traducciones al inglés. Las claves coinciden con data-i18n del HTML.
// El texto en español es el que está escrito directamente en el HTML.
const EN = {
  meta_desc: "AvoPack — Avocado packing house in Ciudad Guzmán, Jalisco, Mexico. Quality avocados for domestic and international markets.",
  brand_tag: "Quality Avocados",

  nav_home: "Home",
  nav_about: "About",
  nav_video: "Video",
  nav_products: "Products",
  nav_quality: "Quality",
  nav_gallery: "Gallery",
  nav_contact: "Contact",

  hero_eyebrow: "Ciudad Guzmán, Jalisco · Mexico",
  hero_title: "Quality avocados,<br>from the heart of Jalisco",
  hero_sub: "We are an avocado packing house committed to freshness, flavor and the highest selection standards. Bringing the best Mexican avocado to your table.",
  hero_cta1: "Request a quote",
  hero_cta2: "See our products",

  stat_1: "Mexican avocado",
  stat_2_num: "Selection",
  stat_2: "by size and quality",
  stat_3: "Active certification",
  stat_4_num: "Domestic + Export",
  stat_4: "and growing",

  about_eyebrow: "About us",
  about_title: "Passion for avocado, quality in every box",
  about_p1: "AvoPack is an avocado packing house located in Ciudad Guzmán, Jalisco. We select, grade and pack avocados with great care to guarantee freshness, ripeness and flawless presentation.",
  about_p2: "Today we serve the domestic market and we are actively expanding into international markets, bringing the flavor of Mexican avocado to more destinations around the world.",
  about_li1: "Rigorous selection by size and quality",
  about_li2: "Careful cold-chain handling",
  about_li3: "Packing tailored to customer needs",

  video_eyebrow: "Video",
  video_title: "See AvoPack in action",
  video_lead: "A look at our orchard, our avocado and the way we work.",

  prod_eyebrow: "Products",
  prod_title: "What we offer",
  prod_lead: "Hass avocado, selected and packed for different markets and presentations.",
  prod1_title: "Hass Avocado",
  prod1_desc: "Premium quality fruit, selected by size, color and optimal ripeness.",
  prod2_title: "Packing by size",
  prod2_desc: "Grading and packing according to size and each customer's requirements.",
  prod3_title: "Custom presentations",
  prod3_desc: "Flexible boxes and formats for domestic and export markets.",

  qual_eyebrow: "Quality & certifications",
  qual_title: "Confidence in every shipment",
  qual_p1: "We work under food-safety and quality guidelines to ensure a reliable product. We hold SENASICA certification, which allows us to serve all international destinations (currently except the United States).",
  qual_badge1: "Active certification",
  qual_badge2_t: "Export",
  qual_badge2: "All destinations (except the U.S.)",
  qual_badge3_t: "Selection",
  qual_badge3: "Quality control by lot",

  gal_eyebrow: "Gallery",
  gal_title: "Get to know AvoPack",

  cont_eyebrow: "Contact",
  cont_title: "Let's talk about your order",
  cont_lead: "Interested in our avocado for domestic or export markets? Write to us and we'll be glad to help.",
  cont_addr: "Ciudad Guzmán, Jalisco, Mexico",

  form_name: "Name",
  form_email: "Email",
  form_phone: "Phone / WhatsApp",
  form_msg: "Message",
  form_send: "Send message",
  form_sending: "Sending…",
  form_ok: "✓ Thank you! Your message was sent. We'll get back to you soon.",
  form_err: "Something went wrong. Please write to us at avopack.empaque@gmail.com or via WhatsApp.",

  footer_tag: "Quality avocados · Ciudad Guzmán, Jalisco, Mexico",

  // Placeholders
  ph_about: "Photo: our facilities",
  ph_prod1: "Photo: Hass avocado",
  ph_prod2: "Photo: packing by size",
  ph_prod3: "Photo: presentations",
  ph_qual: "Photo: quality control",
  ph_g1: "Photo 1", ph_g2: "Photo 2", ph_g3: "Photo 3",
  ph_g4: "Photo 4", ph_g5: "Photo 5", ph_g6: "Photo 6",
};

// Guarda el texto original en español la primera vez.
const nodes = document.querySelectorAll("[data-i18n]");
const ES = {};
nodes.forEach((n) => { ES[n.getAttribute("data-i18n")] = n.innerHTML; });

// Mensajes en español que no están en el HTML (estados del formulario)
ES.form_sending = "Enviando…";
ES.form_ok = "✓ ¡Gracias! Tu mensaje fue enviado. Te contactaremos pronto.";
ES.form_err = "Ocurrió un error. Escríbenos a avopack.empaque@gmail.com o por WhatsApp.";

function t(key) { return (document.body.classList.contains("en") ? EN : ES)[key]; }

function setLang(lang) {
  const isEN = lang === "en";
  document.body.classList.toggle("en", isEN);
  document.documentElement.lang = isEN ? "en" : "es";
  nodes.forEach((n) => {
    const key = n.getAttribute("data-i18n");
    const dict = isEN ? EN : ES;
    if (dict[key] !== undefined) {
      if (key === "meta_desc") {
        n.setAttribute("content", dict[key]);
      } else {
        n.innerHTML = dict[key];
      }
    }
  });
  try { localStorage.setItem("avopack-lang", lang); } catch (e) {}
}

// Idioma inicial: guardado o navegador.
const saved = (() => { try { return localStorage.getItem("avopack-lang"); } catch (e) { return null; } })();
const initial = saved || (navigator.language && navigator.language.startsWith("en") ? "en" : "es");
setLang(initial);

document.getElementById("langToggle").addEventListener("click", () => {
  setLang(document.body.classList.contains("en") ? "es" : "en");
});

// Menú móvil
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
});
nav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  })
);

// Envío del formulario sin salir de la página (AJAX a FormSubmit)
const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");
if (form) {
  const submitBtn = form.querySelector('button[type="submit"]');
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.className = "form-status";
    status.textContent = "";
    submitBtn.disabled = true;
    submitBtn.textContent = t("form_sending");

    try {
      const res = await fetch("https://formsubmit.co/ajax/avopack.empaque@gmail.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      if (!res.ok) throw new Error("bad status");
      status.className = "form-status ok";
      status.textContent = t("form_ok");
      form.reset();
    } catch (err) {
      status.className = "form-status err";
      status.textContent = t("form_err");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = t("form_send");
    }
  });
}

// Año en el footer
document.getElementById("year").textContent = new Date().getFullYear();
