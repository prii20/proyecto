document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Registro exitoso, ahora podés iniciar sesión");
      window.location.href = "login.html";
    } else {
      alert(data.message || "Error al registrar");
    }
  } catch (err) {
    console.error(err);
    alert("Error al conectar con el servidor");
  }
});
