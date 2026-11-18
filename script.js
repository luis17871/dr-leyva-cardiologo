// Número de WhatsApp oficial para coordinación de citas (formato internacional sin signos ni espacios)
const WHATSAPP = "593995392252";

document.addEventListener("DOMContentLoaded", () => {
  /* --------------------------------------------------------------------------
     1. MENÚ MÓVIL Y NAVEGACIÓN ACCESIBLE
     -------------------------------------------------------------------------- */
  const navToggle = document.getElementById("navToggle");
  const menu = document.getElementById("menu");

  if (navToggle && menu) {
    const closeMenu = () => {
      menu.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    };

    navToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = menu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    // Cerrar al pulsar cualquier enlace del menú
    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Cerrar con tecla Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("open")) {
        closeMenu();
        navToggle.focus();
      }
    });

    // Cerrar al hacer clic fuera del menú o del botón
    document.addEventListener("click", (e) => {
      if (
        menu.classList.contains("open") &&
        !menu.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        closeMenu();
      }
    });
  }

  /* --------------------------------------------------------------------------
     2. HEADER SCROLL EFFECT
     -------------------------------------------------------------------------- */
  const header = document.getElementById("header");
  if (header) {
    const handleScroll = () => {
      header.classList.toggle("scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
  }

  /* --------------------------------------------------------------------------
     3. ANIMACIÓN SCROLL REVEAL CON FALLBACK
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll(".reveal");
  if (revealElements.length > 0) {
    if ("IntersectionObserver" in window) {
      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
      );

      revealElements.forEach((el) => revealObserver.observe(el));
    } else {
      // Fallback para navegadores antiguos sin soporte de IntersectionObserver
      revealElements.forEach((el) => el.classList.add("visible"));
    }
  }

  /* --------------------------------------------------------------------------
     4. BOTÓN FLOTANTE WHATSAPP (OCULTAR EN SECCIÓN DE CITA)
     -------------------------------------------------------------------------- */
  const waFloat = document.getElementById("waFloat");
  const citaSection = document.getElementById("cita");

  if (waFloat && citaSection && "IntersectionObserver" in window) {
    const citaObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          waFloat.classList.toggle("is-hidden", entry.isIntersecting);
        });
      },
      { threshold: 0.1 }
    );

    citaObserver.observe(citaSection);
  }

  /* --------------------------------------------------------------------------
     5. FECHA MÍNIMA LOCAL PARA EL CALENDARIO
     -------------------------------------------------------------------------- */
  const fechaInput = document.getElementById("fecha");
  if (fechaInput) {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    fechaInput.min = `${year}-${month}-${day}`;
  }

  /* --------------------------------------------------------------------------
     6. FORMULARIO DE CITA -> VALIDACIÓN Y ENVÍO A WHATSAPP
     -------------------------------------------------------------------------- */
  const form = document.getElementById("citaForm");
  const formNote = document.getElementById("formNote");

  if (form) {
    const requiredFieldIds = ["nombre", "telefono", "fecha"];
    const requiredElements = requiredFieldIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    // Limpiar alertas de error al escribir o modificar un campo
    requiredElements.forEach((input) => {
      const clearError = () => {
        if (input.value.trim() !== "") {
          input.classList.remove("invalid");
          input.removeAttribute("aria-invalid");
          if (formNote) {
            formNote.textContent = "";
            formNote.classList.remove("error");
          }
        }
      };

      input.addEventListener("input", clearError);
      input.addEventListener("change", clearError);
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      let isFormValid = true;
      let firstInvalidElement = null;

      requiredElements.forEach((input) => {
        const value = input.value.trim();
        if (!value) {
          input.classList.add("invalid");
          input.setAttribute("aria-invalid", "true");
          isFormValid = false;
          if (!firstInvalidElement) {
            firstInvalidElement = input;
          }
        } else {
          input.classList.remove("invalid");
          input.removeAttribute("aria-invalid");
        }
      });

      if (!isFormValid) {
        if (formNote) {
          formNote.textContent = "Por favor completa los campos obligatorios.";
          formNote.classList.add("error");
        }
        if (firstInvalidElement) {
          firstInvalidElement.focus();
        }
        return;
      }

      if (formNote) {
        formNote.textContent = "";
        formNote.classList.remove("error");
      }

      const formData = new FormData(form);
      const nombre = (formData.get("nombre") || "").trim();
      const telefono = (formData.get("telefono") || "").trim();
      const fecha = (formData.get("fecha") || "").trim();
      const servicio = (formData.get("servicio") || "").trim();
      const mensaje = (formData.get("mensaje") || "").trim();

      let whatsappMessage =
        `Hola Dr. Carlos Leyva, quisiera agendar una cita.\n` +
        `Nombre: ${nombre}\n` +
        `Teléfono: ${telefono}\n` +
        `Fecha preferida: ${fecha}\n` +
        `Servicio: ${servicio}`;

      if (mensaje) {
        whatsappMessage += `\nMotivo: ${mensaje}`;
      }

      const whatsappUrl = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    });
  }

  /* --------------------------------------------------------------------------
     7. AÑO ACTUAL EN EL FOOTER
     -------------------------------------------------------------------------- */
  const yearElement = document.getElementById("year");
  if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
  }
});
