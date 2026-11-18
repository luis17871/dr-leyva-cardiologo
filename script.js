// Número de WhatsApp del consultorio (formato internacional, sin + ni espacios)
const WHATSAPP = "593995392252";

// Menú móvil
const toggle = document.getElementById("navToggle");
const menu = document.getElementById("menu");
const setMenu = (open) => {
  menu.classList.toggle("open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
};
toggle.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

// Borde del header al hacer scroll
const header = document.getElementById("header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
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

// Ocultar el botón flotante de WhatsApp mientras se ve el formulario (evita que tape "Enviar")
const waFloat = document.getElementById("waFloat");
const citaSection = document.getElementById("cita");
new IntersectionObserver(([e]) => waFloat.classList.toggle("is-hidden", e.isIntersecting), { threshold: 0.15 })
  .observe(citaSection);

// Fecha mínima = hoy (fecha local, no UTC)
const fecha = document.getElementById("fecha");
const hoy = new Date();
fecha.min = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60000).toISOString().split("T")[0];

// Formulario -> WhatsApp
const form = document.getElementById("citaForm");
const note = document.getElementById("formNote");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let firstBad = null;
  ["nombre", "telefono", "fecha"].forEach((id) => {
    const f = document.getElementById(id);
    const bad = !f.value.trim();
    f.classList.toggle("invalid", bad);
    f.setAttribute("aria-invalid", String(bad));
    if (bad && !firstBad) firstBad = f;
  });
  if (firstBad) {
    note.textContent = "Por favor completa los campos obligatorios.";
    firstBad.focus();
    return;
  }
  note.textContent = "";
  const d = Object.fromEntries(new FormData(form));
  const msg =
    `Hola Dr. Carlos Leyva, quisiera agendar una cita.%0A` +
    `Nombre: ${encodeURIComponent(d.nombre)}%0A` +
    `Teléfono: ${encodeURIComponent(d.telefono)}%0A` +
    `Fecha preferida: ${encodeURIComponent(d.fecha)}%0A` +
    `Servicio: ${encodeURIComponent(d.servicio)}` +
    (d.mensaje ? `%0AMotivo: ${encodeURIComponent(d.mensaje)}` : "");
  window.open(`https://wa.me/${WHATSAPP}?text=${msg}`, "_blank", "noopener");
});

document.getElementById("year").textContent = new Date().getFullYear();
