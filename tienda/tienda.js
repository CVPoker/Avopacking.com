/* ====== AvoPack — Tienda en línea ======
   Los precios salen de /tienda/precios.json: plantilla de venta de la semana + $19 por kilo.
   A dónde llegamos sale de /tienda/zonas.json: municipios por zona, con su envío.
   Los pedidos, las altas de negocio y los «avísame» llegan por correo (FormSubmit),
   como el contacto de la portada. */

const CORREO = "avopack.empaque@gmail.com";
const ENVIO = "https://formsubmit.co/ajax/" + CORREO;
const MALLAS_MINIMAS = 8;
const OTRO = "Otro municipio";

const pesos = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 });
const pesosConCentavos = new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 2 });
const fechaLarga = new Intl.DateTimeFormat("es-MX", { day: "numeric", month: "long", timeZone: "UTC" });

let productos = [];
let zonas = [];
let proximamente = [];
let vigentesDesde = "";
const cantidades = {};
const zonaDe = {};

const $ = (id) => document.getElementById(id);
const grid = $("productosGrid");
const pedidoForm = $("pedidoForm");
const pedidoEnviar = $("pedidoEnviar");
const pedidoMunicipio = $("pedidoMunicipio");
const barra = $("barraPedido");

function el(tag, attrs, texto) {
  const n = document.createElement(tag);
  Object.entries(attrs || {}).forEach(([k, v]) => n.setAttribute(k, v));
  if (texto !== undefined) n.textContent = texto;
  return n;
}

function esMalla(p) { return p.id === "malla"; }

function textoEnvio(z) {
  if (!z.envio) return "envío sin costo";
  const cajas = Math.round(z.envio_gratis_desde_kg / 10);
  return "envío " + pesos.format(z.envio) + ", o sin costo desde " + cajas + " cajas";
}

/* ====== PRODUCTOS ====== */
function tarjeta(p) {
  const card = el("article", { class: "card producto" });
  card.append(
    el("img", { src: p.foto, alt: p.foto_alt, class: "ph-photo", loading: "lazy" }),
    el("h3", {}, p.nombre),
    el("p", {}, p.descripcion),
    el("p", { class: "precio" }, pesos.format(p.precio)),
    el("p", { class: "precio-kg" }, pesosConCentavos.format(p.precio / p.kg) + " el kilo")
  );

  const stepper = el("div", { class: "stepper" });
  const menos = el("button", { type: "button", "aria-label": "Quitar una " + p.nombre }, "−");
  const cuantas = el("output", { "aria-live": "polite", "aria-label": "Cantidad de " + p.nombre }, "0");
  const mas = el("button", { type: "button", "aria-label": "Agregar una " + p.nombre }, "+");
  menos.disabled = true;

  const cambiar = (delta) => {
    cantidades[p.id] = Math.min(99, Math.max(0, (cantidades[p.id] || 0) + delta));
    cuantas.textContent = String(cantidades[p.id]);
    menos.disabled = cantidades[p.id] === 0;
    pintarResumen();
  };
  menos.addEventListener("click", () => cambiar(-1));
  mas.addEventListener("click", () => cambiar(1));
  p.reiniciar = () => { cantidades[p.id] = 0; cuantas.textContent = "0"; menos.disabled = true; };

  stepper.append(menos, cuantas, mas);
  card.append(stepper);
  return card;
}

/* ====== ZONAS ====== */
function pintarZonas() {
  const caja = $("zonas");
  zonas.forEach((z, i) => {
    const tarjetaZona = el("div", { class: "zona" });
    tarjetaZona.append(el("h3", {}, "Zona " + (i + 1) + ": " + textoEnvio(z)));
    const lista = el("ul", { class: "municipios" });
    z.municipios.forEach((m) => {
      const li = el("li", {}, m.nombre);
      if (m.km) li.append(el("small", {}, " · " + m.km + " km"));
      lista.append(li);
    });
    tarjetaZona.append(lista);
    caja.append(tarjetaZona);
  });
  if (proximamente.length) {
    const pronto = el("p", { class: "proximamente" }, "Próximamente: " + proximamente.join(", ") + ".");
    caja.append(pronto);
  }

  // Los selectores de municipio de los formularios: sólo donde sí llegamos, agrupados por zona.
  document.querySelectorAll("[data-municipios]").forEach((sel) => {
    zonas.forEach((z, i) => {
      const grupo = el("optgroup", { label: "Zona " + (i + 1) + " · " + textoEnvio(z) });
      z.municipios.forEach((m) => grupo.append(el("option", { value: m.nombre }, m.nombre)));
      sel.append(grupo);
    });
  });

  // El selector de «¿Llegamos a tu casa?»: también los de próximamente y «otro».
  const revisar = $("revisarMunicipio");
  zonas.forEach((z) => z.municipios.forEach((m) => revisar.append(el("option", { value: m.nombre }, m.nombre))));
  proximamente.forEach((m) => revisar.append(el("option", { value: m }, m)));
  revisar.append(el("option", { value: OTRO }, OTRO));

  // La regla de negocios por zona.
  const reglas = $("negociosReglas");
  zonas.slice().reverse().forEach((z) => {
    const nombres = z.municipios.map((m) => m.nombre.replace(/ \(.*\)$/, ""));
    reglas.prepend(el("li", {}, "Pedido mínimo de " + z.minimo_negocio_kg + " kg en " + nombres.join(", ")));
  });
}

function revisarMunicipio() {
  const m = $("revisarMunicipio").value;
  const res = $("revisarResultado");
  const avisame = $("avisameForm");
  if (!m) { res.hidden = true; avisame.hidden = true; return; }
  res.hidden = false;
  const z = zonaDe[m];
  if (z) {
    res.className = "aviso ok";
    res.textContent = "¡Sí llegamos a " + m + "! Te lo llevamos el martes, con " + textoEnvio(z) + ".";
    avisame.hidden = true;
    pedidoMunicipio.value = m;
    pintarResumen();
  } else {
    res.className = "aviso";
    res.textContent = m === OTRO
      ? "Todavía no llegamos a todos lados."
      : "Todavía no llegamos a " + m + ", pero ya viene.";
    avisame.hidden = false;
    avisame.elements.municipio.value = m === OTRO ? "" : m;
  }
}

/* ====== PEDIDO ====== */
function lineas() {
  return productos
    .filter((p) => cantidades[p.id] > 0)
    .map((p) => ({ p, n: cantidades[p.id], importe: cantidades[p.id] * p.precio }));
}

function cumpleMinimo() {
  const cajas = productos.filter((p) => !esMalla(p)).reduce((s, p) => s + (cantidades[p.id] || 0), 0);
  const mallas = productos.filter(esMalla).reduce((s, p) => s + (cantidades[p.id] || 0), 0);
  return cajas >= 1 || mallas >= MALLAS_MINIMAS;
}

// null mientras no hay municipio escogido.
function envio() {
  const z = zonaDe[pedidoMunicipio.value];
  if (!z) return null;
  const kg = productos.reduce((s, p) => s + (cantidades[p.id] || 0) * p.kg, 0);
  return z.envio && kg < z.envio_gratis_desde_kg ? z.envio : 0;
}

function cuentas() {
  const ls = lineas();
  const productosTotal = ls.reduce((s, l) => s + l.importe, 0);
  const e = envio();
  return { ls, productosTotal, envio: e, total: productosTotal + (e || 0) };
}

function pintarResumen() {
  const { ls, productosTotal, envio: e, total } = cuentas();
  const resumen = $("resumen");
  resumen.replaceChildren();
  if (ls.length === 0) {
    const vacio = el("li", { class: "resumen-vacio" }, "Todavía no escoges nada. Sube a ");
    vacio.append(el("a", { href: "#productos" }, "Productos"), document.createTextNode("."));
    resumen.append(vacio);
  }
  ls.forEach(({ p, n, importe }) => {
    const li = el("li");
    li.append(el("span", {}, n + " × " + p.nombre), el("strong", {}, pesos.format(importe)));
    resumen.append(li);
  });
  $("envio").textContent = e === null ? "escoge tu municipio" : e === 0 ? "sin costo" : pesos.format(e);
  $("total").textContent = pesos.format(total);
  $("barraTotal").textContent = pesos.format(total);
  barra.hidden = productosTotal === 0;

  const ok = cumpleMinimo();
  const minimo = $("minimo");
  minimo.className = ok ? "aviso ok" : "aviso";
  minimo.textContent = ok
    ? "Tu pedido cumple el mínimo."
    : "Pedido mínimo: una caja de 10 kg u " + MALLAS_MINIMAS + " mallas.";
  pedidoEnviar.disabled = !ok;
}

async function cargar() {
  try {
    const [rp, rz] = await Promise.all([
      fetch("/tienda/precios.json", { cache: "no-store" }),
      fetch("/tienda/zonas.json", { cache: "no-store" }),
    ]);
    if (!rp.ok || !rz.ok) throw new Error("datos " + rp.status + " " + rz.status);
    const [precios, z] = await Promise.all([rp.json(), rz.json()]);
    productos = precios.productos;
    vigentesDesde = precios.vigentes_desde;
    zonas = z.zonas;
    proximamente = z.proximamente || [];
    zonas.forEach((zona) => zona.municipios.forEach((m) => { zonaDe[m.nombre] = zona; }));

    productos.forEach((p) => { cantidades[p.id] = 0; grid.append(tarjeta(p)); });
    $("preciosVigencia").textContent = "Precios de la semana del " + fechaLarga.format(new Date(vigentesDesde)) + ".";
    pintarZonas();
    pintarResumen();
  } catch (e) {
    $("preciosVigencia").textContent = "";
    const aviso = el("p", { class: "aviso aviso-err" }, "No pudimos cargar la tienda. Escríbenos a ");
    aviso.append(el("a", { href: "mailto:" + CORREO }, CORREO), document.createTextNode("."));
    grid.replaceWith(aviso);
  }
}

/* ====== FORMULARIOS ====== */
// «Quiero factura» enseña sus campos y los vuelve obligatorios.
document.querySelectorAll("[data-factura]").forEach((check) => {
  const caja = $(check.dataset.factura);
  const alternar = () => {
    caja.hidden = !check.checked;
    caja.querySelectorAll("[data-requerido]").forEach((i) => { i.required = check.checked; });
  };
  check.addEventListener("change", alternar);
  alternar();
});

async function enviar(form, status, mensajeOk, antes) {
  status.className = "form-status";
  status.textContent = "";
  if (!form.reportValidity()) return false;
  if (antes) antes();

  const boton = form.querySelector('button[type="submit"]');
  const texto = boton.textContent;
  boton.disabled = true;
  boton.textContent = "Enviando…";
  try {
    const res = await fetch(ENVIO, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    if (!res.ok) throw new Error("envío " + res.status);
    status.className = "form-status ok";
    status.textContent = mensajeOk;
    form.reset();
    form.querySelectorAll("[data-factura]").forEach((c) => c.dispatchEvent(new Event("change")));
    return true;
  } catch (e) {
    status.className = "form-status err";
    status.textContent = "No se pudo enviar. Inténtalo otra vez o escríbenos a " + CORREO + ".";
    return false;
  } finally {
    boton.textContent = texto;
    boton.disabled = false;
  }
}

pedidoMunicipio.addEventListener("change", pintarResumen);
$("revisarMunicipio").addEventListener("change", revisarMunicipio);

pedidoForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!cumpleMinimo()) return;
  const correo = pedidoForm.elements.email.value;
  const ok = await enviar(
    pedidoForm,
    $("pedidoStatus"),
    "¡Listo! Recibimos tu pedido. Te mandamos el link de pago a " + correo + ".",
    () => {
      const c = cuentas();
      $("campoPedido").value =
        c.ls.map(({ p, n, importe }) => n + " × " + p.nombre + " = " + pesos.format(importe)).join(" · ");
      $("campoEnvio").value = pesos.format(c.envio || 0);
      $("campoTotal").value = pesos.format(c.total);
      $("campoPrecios").value = "Precios de la semana del " + vigentesDesde;
    }
  );
  if (ok) productos.forEach((p) => p.reiniciar());
  pintarResumen();
});

$("negocioForm").addEventListener("submit", (e) => {
  e.preventDefault();
  enviar(
    e.currentTarget,
    $("negocioStatus"),
    "¡Gracias! Recibimos tu solicitud. Te escribimos por correo para confirmar tu alta."
  );
});

$("avisameForm").addEventListener("submit", (e) => {
  e.preventDefault();
  enviar(
    e.currentTarget,
    $("avisameStatus"),
    "¡Listo! Te avisamos por correo en cuanto lleguemos."
  );
});

// Mientras el formulario del pedido está a la vista, la barra sobra (y taparía el botón de enviar).
if ("IntersectionObserver" in window) {
  new IntersectionObserver(([e]) => barra.classList.toggle("en-pedido", e.isIntersecting))
    .observe($("pedido"));
}

// Menú móvil
const menuBtn = $("menuBtn");
const nav = $("nav");
menuBtn.addEventListener("click", () => {
  const abierto = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", abierto ? "true" : "false");
});
nav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  })
);

$("year").textContent = new Date().getFullYear();
cargar();
