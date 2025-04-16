const form = document.querySelector(".form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.querySelector(".email").value;
    const password = document.querySelector(".password").value;

    try {
        const res = await fetch(`https://cart-special.vercel.app/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "true" // Necesario para ngrok
            },
            body: JSON.stringify({ email, password }),
            credentials: "include" // Importante para cookies
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Error en la autenticación");
        }

        // Almacenar el token (2 opciones)
        
        // Opción 1: LocalStorage (sencillo pero menos seguro)
        localStorage.setItem("token", data.token);
        
        // Opción 2: Cookie manejada por el backend (más seguro)
        // El backend debe enviar Set-Cookie header
        
        // Redirección
        window.location.href = data.redirectTo || "/dashboard.html";
        
    } catch (err) {
        console.error("Error:", err);
        alert(err.message || "Error al conectar con el servidor");
    }
});