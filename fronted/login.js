document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log("Respuesta del servidor:", data);

    if (res.ok) {
      // Guardamos token y rol
      localStorage.setItem("token", data.token);
      localStorage.setItem("rol", data.user.rol);
      localStorage.setItem("nombre", data.user.nombre);

      // Redirigir según rol
      if (data.user.rol === "admin") {
        window.location.href = "admin.html";
      } else {
        window.location.href = "index.html";
      }
    } else {
      alert(data.message || "Error en el login");
    }
  } catch (err) {
    console.error("Error:", err);
    alert("Error al conectar con el servidor");
  }
});
