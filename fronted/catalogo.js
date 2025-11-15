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

