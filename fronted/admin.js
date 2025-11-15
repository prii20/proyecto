
 lucide.createIcons();
    const API_URL = "http://localhost:3000/api/lamparas";
    const contenedor = document.getElementById("productos");
    const modal = document.getElementById("modalEditar");

    // 🟢 Cargar lámparas
    async function cargarLamparas() {
      const res = await fetch(API_URL);
      const data = await res.json();
      contenedor.innerHTML = "";

      data.forEach(l => {
        const card = document.createElement("div");
        card.className = "bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden";
        card.innerHTML = `
          <img src="${l.ruta_imagen}" alt="${l.nombre}" class="w-full h-48 object-cover">
          <div class="p-4">
            <h3 class="text-lg font-semibold text-gray-800">${l.nombre}</h3>
            <p class="text-gray-600">${l.descripcion}</p>
           
            <div class="mt-3 flex gap-3">
              <button onclick="abrirModal(${l.id}, '${l.nombre}', '${l.descripcion}', '${l.tipo}', '${l.ruta_imagen}')"
                class="bg-yellow-500 text-white px-3 py-1 rounded-lg flex items-center gap-1 hover:bg-yellow-600 transition">
                <i data-lucide="edit"></i> Editar
              </button>
              <button onclick="eliminarLampara(${l.id})"
                class="bg-red-500 text-white px-3 py-1 rounded-lg flex items-center gap-1 hover:bg-red-600 transition">
                <i data-lucide="trash-2"></i> Eliminar
              </button>
            </div>
          </div>
        `;
        contenedor.appendChild(card);
      });

      lucide.createIcons();
    }

    // 🟣 Agregar lámpara
    document.getElementById("formAgregar").addEventListener("submit", async (e) => {
      e.preventDefault();
      const nuevaLampara = {
        nombre: nombre.value,
        descripcion: descripcion.value,
        tipo: tipo.value,
        ruta_imagen: ruta_imagen.value
      };
      const token = localStorage.getItem("token");

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(nuevaLampara)
      });

      const data = await res.json();
      alert(data.message);
      cargarLamparas();
      e.target.reset();
    });

    // 🟡 Eliminar lámpara
    async function eliminarLampara(id) {
      if (!confirm("¿Eliminar esta lámpara?")) return;
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      alert(data.message);
      cargarLamparas();
    }

    // ✏️ Abrir modal editar
    function abrirModal(id, nombre, descripcion, tipo, ruta) {
      document.getElementById("editId").value = id;
      document.getElementById("editNombre").value = nombre;
      document.getElementById("editDescripcion").value = descripcion;
      document.getElementById("editTipo").value = tipo;
      document.getElementById("editRuta").value = ruta;
      modal.classList.remove("hidden");
      lucide.createIcons();
    }

    // ❌ Cerrar modal
    function cerrarModal() {
      modal.classList.add("hidden");
    }

    // 💾 Guardar edición
    document.getElementById("formEditar").addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = editId.value;
      const lamparaEditada = {
        nombre: editNombre.value,
        descripcion: editDescripcion.value,
        tipo: editTipo.value,
        ruta_imagen: editRuta.value
      };
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(lamparaEditada)
      });
      const data = await res.json();
      alert(data.message);
      cerrarModal();
      cargarLamparas();
    });

    // 🔴 Cerrar sesión
    document.getElementById("logoutBtn").addEventListener("click", () => {
      localStorage.clear();
      window.location.href = "login.html";
    });

    cargarLamparas();

  