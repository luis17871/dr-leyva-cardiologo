// Número de WhatsApp del consultorio (formato internacional, sin + ni espacios)
const WHATSAPP = "520000000000";

// Menú móvil
const toggle = document.getElementById("navToggle");
const menu = document.getElementById("menu");
toggle.addEventListener("click", () => {
  const open = menu.classList.toggle("open");
  toggle.setAttribute("aria-expanded", open);
});
menu.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    menu.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  })
);

// Sombra del header al hacer scroll
const header = document.getElementById("header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 10);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Animación de aparición
const io = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        io.unobserve(e.target);
      }
    }),
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// Contadores
const counters = document.querySelectorAll("[data-count]");
const countIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const end = +el.dataset.count;
    const start = performance.now();
    const step = (t) => {
      const p = Math.min((t - start) / 1400, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))).toLocaleString("es-MX");
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    countIO.unobserve(el);
  });
});
counters.forEach((c) => countIO.observe(c));

// Fecha mínima = hoy
const fecha = document.getElementById("fecha");
fecha.min = new Date().toISOString().split("T")[0];

// Formulario -> WhatsApp
const form = document.getElementById("citaForm");
const note = document.getElementById("formNote");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let ok = true;
  ["nombre", "telefono", "fecha"].forEach((id) => {
    const f = document.getElementById(id);
    const bad = !f.value.trim();
    f.classList.toggle("invalid", bad);
    if (bad) ok = false;
  });
  if (!ok) {
    note.textContent = "Por favor completa los campos obligatorios.";
    return;
  }
  note.textContent = "";
  const d = Object.fromEntries(new FormData(form));
  const msg =
    `Hola Dr. Leyva, quisiera agendar una cita.%0A` +
    `Nombre: ${encodeURIComponent(d.nombre)}%0A` +
    `Teléfono: ${encodeURIComponent(d.telefono)}%0A` +
    `Fecha preferida: ${encodeURIComponent(d.fecha)}%0A` +
    `Servicio: ${encodeURIComponent(d.servicio)}` +
    (d.mensaje ? `%0AMotivo: ${encodeURIComponent(d.mensaje)}` : "");
  window.open(`https://wa.me/${WHATSAPP}?text=${msg}`, "_blank", "noopener");
});

document.getElementById("year").textContent = new Date().getFullYear();
