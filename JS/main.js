const menuButton = document.querySelector(".menu-button");
const navLinks = document.querySelector("#nav-links");

// Agrega aquí el número definitivo, con código de país y solo dígitos.
// Ejemplo para México: "5215512345678".
const WHATSAPP_NUMBER = "";

document.querySelectorAll("[data-whatsapp-link]").forEach((link) => {
    if (WHATSAPP_NUMBER) {
        const message = "Hola, me gustaría solicitar una cita.";
        link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        link.removeAttribute("aria-disabled");
        link.setAttribute("aria-label", "Contactar por WhatsApp");
        link.classList.add("is-ready");

        const label = link.querySelector("[data-whatsapp-label]");

        if (label) {
            label.textContent = "WhatsApp";
        }
    } else {
        link.addEventListener("click", (event) => event.preventDefault());
    }
});

if (menuButton && navLinks) {
    const setMenuState = (isOpen) => {
        navLinks.classList.toggle("is-open", isOpen);
        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
        menuButton.textContent = isOpen ? "✕" : "☰";
    };

    menuButton.addEventListener("click", () => {
        const isOpen = menuButton.getAttribute("aria-expanded") === "true";
        setMenuState(!isOpen);
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => setMenuState(false));
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            setMenuState(false);
            menuButton.focus();
        }
    });
}

// El formulario no guarda datos. Solo prepara un mensaje para WhatsApp.
const appointmentForm = document.querySelector("#appointment-form");

if (appointmentForm) {
    const dateInput = document.querySelector("#date");
    const formMessage = document.querySelector("#form-message");

    // Evita que se pueda elegir una fecha anterior a hoy.
    const today = new Date();
    const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0];
    dateInput.min = localToday;

    appointmentForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!appointmentForm.checkValidity()) {
            appointmentForm.reportValidity();
            return;
        }

        if (!WHATSAPP_NUMBER) {
            formMessage.textContent = "El número de WhatsApp de la clínica está pendiente de confirmación.";
            return;
        }

        const name = document.querySelector("#name").value.trim();
        const phone = document.querySelector("#phone").value.trim();
        const service = document.querySelector("#service").value;
        const date = document.querySelector("#date").value;
        const time = document.querySelector("#time").value;
        const [year, month, day] = date.split("-");
        const formattedDate = `${day}/${month}/${year}`;

        const message = [
            "Hola, me gustaría solicitar una cita.",
            "",
            `Nombre: ${name}`,
            `Teléfono: ${phone}`,
            `Servicio: ${service}`,
            `Fecha preferida: ${formattedDate}`,
            `Horario preferido: ${time}`,
        ].join("\n");

        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

        formMessage.textContent = "Abriendo WhatsApp para que envíes tu solicitud.";
        window.open(whatsappUrl, "_blank", "noopener");
    });
}