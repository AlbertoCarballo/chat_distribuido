import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://192.168.1.156:3001"); // IP y puerto de tu backend

function Login() {
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setError(null);
    
        socket.emit("login", { nombreUsuario, contraseña }, (response) => {
            if (response.success) {
                // ✅ Guardar solo el nombre del usuario (más simple)
                localStorage.setItem("usuario", nombreUsuario);
    
                // ⛳ Redireccionar
                navigate("/chat");
            } else {
                // ❌ Error de login
                setError(response.mensaje);
            }
        });
    };

    return (
        <form onSubmit={handleLogin} style={{ maxWidth: 300, margin: "auto", marginTop: 50 }}>
            <h2>Login</h2>
            <input
                type="text"
                placeholder="Nombre de usuario"
                value={nombreUsuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
                required
                style={{ width: "100%", marginBottom: 10, padding: 8 }}
            />
            <input
                type="password"
                placeholder="Contraseña"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                required
                style={{ width: "100%", marginBottom: 10, padding: 8 }}
            />
            {error && <p style={{ color: "red" }}>{error}</p>}
            <button type="submit" style={{ width: "100%", padding: 10 }}>
                Entrar
            </button>
        </form>
    );
}

export default Login;
