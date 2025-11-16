document.addEventListener("DOMContentLoaded", async () => {
  const contenedor = document.getElementById("catalogo");

  // Limpia los artículos fijos
  contenedor.innerHTML = "";

  try {
    console.log("🔍 Cargando lámparas desde el backend...");

    const respuesta = await fetch("http://localhost:3000/api/lamparas");
    const lamparas = await respuesta.json();

    console.log("🔦 LÁMPARAS DESDE EL BACK:", lamparas);

    if (!Array.isArray(lamparas)) {
      console.error("❌ La API no devolvió un array.");
      return;
    }

    lamparas.forEach((l) => {
      const card = document.createElement("article");
      card.classList.add("location-listing");

      card.innerHTML = `
        <a class="location-title" href="#">${l.nombre}</a>
        <div class="location-image">
            <img src="${l.ruta_imagen}" alt="${l.nombre}">
        </div>
      `;

      contenedor.appendChild(card);
      setTimeout(() => {
        card.classList.add("visible");
      }, 50);

    });

  } catch (error) {
    console.error("❌ Error cargando lámparas:", error);
  }
});


//logica y animaciones para el footer




gsap.from(".animated-footer", {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: "power3.out",
    scrollTrigger: {
        trigger: ".animated-footer",
        start: "top 80%", 
        toggleActions: "play none none reverse",
         // Reproduce la animación una vez y la revierte al salir
         
    }
});

// Animación de los elementos individuales dentro del footer
gsap.timeline({
    scrollTrigger: {
        trigger: ".animated-footer",
        start: "top 80%",
        toggleActions: "play none none reverse",
        
    }
})
.from(".footer-logo", {
    opacity: 0,
    y: 20,
    duration: 0.8,
    ease: "power2.out"
}, "<")
.from(".footer-divider", {
    opacity: 0,
    scaleX: 0,
    duration: 0.8,
    ease: "power2.out"
}, "-=0.4") 
.from(".footer-heading-redes", {
    opacity: 0,
    x: -20,
    duration: 0.6,
    ease: "power2.out"
}, "-=0.3")
.from(".container-footerRedes .social-icon", {
    opacity: 0,
    y: 20,
    stagger: 0.15, 
    duration: 0.5,
    ease: "back.out(1.7)" 
}, "-=0.2")
.from(".footer-heading-contact", {
    opacity: 0,
    x: 20,
    duration: 0.6,
    ease: "power2.out"
}, "-=0.3");



document.querySelectorAll(".social-icon").forEach(icon => {
    icon.addEventListener("mouseenter", () => {
        gsap.to(icon, {
            y: -5,
            scale: 1.1,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    icon.addEventListener("mouseleave", () => {
        gsap.to(icon, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
        });
    });
});