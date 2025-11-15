const API_URL = "http://localhost:3000/api/usuarios"; 
const token = localStorage.getItem("token");

// 🔹 Cargar usuarios
async function cargarUsuarios() {
  try {
    const res = await fetch(API_URL, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      throw new Error("No tienes permiso para ver esta página");
    }

    const data = await res.json();
    const tabla = document.getElementById("tablaUsuarios");
    tabla.innerHTML = "";

    data.forEach(u => {
      const fila = document.createElement("tr");
      fila.className = "hover:bg-gray-50 transition";

      // 🔹 Mostrar el rol en español (para que sea más legible)
      const rolTexto = u.rol === "admin" ? "Administrador" : "Usuario";

      fila.innerHTML = `
        <td class="px-4 py-2 text-center">${u.id}</td>
        <td class="px-4 py-2">${u.nombre}</td>
        <td class="px-4 py-2">${u.email}</td>
        <td class="px-4 py-2 text-center">${rolTexto}</td>
        <td class="px-4 py-2 flex justify-center gap-3">
          <button onclick="abrirEditar(${u.id}, '${u.nombre}', '${u.email}', '${u.rol}')" 
            class="text-blue-600 hover:text-blue-800 transition"><i data-lucide="edit"></i></button>
          <button onclick="eliminarUsuario(${u.id})" 
            class="text-red-600 hover:text-red-800 transition"><i data-lucide="trash-2"></i></button>
        </td>
      `;
      tabla.appendChild(fila);
    });
    lucide.createIcons();
  } catch (err) {
    mostrarMensaje("⚠️ " + err.message, "red");
  }
}

// 🔹 Mostrar mensaje bonito
function mostrarMensaje(texto, color = "green") {
  const cont = document.getElementById("mensaje");
  cont.innerText = texto;
  cont.className = `fixed top-4 right-4 px-4 py-2 rounded-lg text-white shadow-lg bg-${color}-500`;
  cont.classList.remove("hidden");
  setTimeout(() => cont.classList.add("hidden"), 3000);
}

// 🔹 Abrir modal de edición
function abrirEditar(id, nombre, email, rol) {
  document.getElementById("modalEditar").classList.remove("hidden");
  document.getElementById("editId").value = id;
  document.getElementById("editNombre").value = nombre;
  document.getElementById("editEmail").value = email;

  // 🔹 Convertir el rol para mostrarlo como texto legible
  const rolTexto = rol === "admin" ? "Administrador" : "Usuario";
  document.getElementById("editRol").value = rolTexto;

  document.getElementById("editPassword").value = "";
}

// 🔹 Cerrar modal
document.getElementById("cancelarEditar").addEventListener("click", () => {
  document.getElementById("modalEditar").classList.add("hidden");
});

// 🔹 Guardar cambios
document.getElementById("formEditar").addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = document.getElementById("editId").value;
  const nombre = document.getElementById("editNombre").value;
  const email = document.getElementById("editEmail").value;
  let rol = document.getElementById("editRol").value.trim();
  const password = document.getElementById("editPassword").value;

  // 🔹 Convertimos el texto mostrado al formato que MySQL espera
  if (rol.toLowerCase() === "usuario") rol = "user";
  if (rol.toLowerCase() === "administrador") rol = "admin";

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ nombre, email, rol, password })
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error al actualizar");

    mostrarMensaje("✅ Usuario actualizado correctamente", "green");
    document.getElementById("modalEditar").classList.add("hidden");
    cargarUsuarios();
  } catch (err) {
    mostrarMensaje("❌ " + err.message, "red");
  }
});

// 🔹 Eliminar usuario
async function eliminarUsuario(id) {
  if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Error al eliminar");
    mostrarMensaje("🗑️ Usuario eliminado correctamente", "green");
    cargarUsuarios();
  } catch (err) {
    mostrarMensaje("❌ " + err.message, "red");
  }
}

// 🔹 Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "login.html";
});

// Inicializa
cargarUsuarios();
