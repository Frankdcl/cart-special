const form = document.querySelector(".form");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const fullName = document.querySelector(".name").value;
      const email = document.querySelector(".email").value;
      const password = document.querySelector(".password").value;

      try {
        const res = await fetch(`${window.APP_CONFIG.API_BASE_URL}/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ fullName , email, password })
        });

        console.log(res)

        const data = await res.json();

        if (res.ok) {
          alert("Registro exitoso");
          window.location.href = "login.html";
        } else {
          alert(data.message || "Error en el registro");
        }
      } catch (err) {
        alert("Error de conexión con el servidor");
      }
    });