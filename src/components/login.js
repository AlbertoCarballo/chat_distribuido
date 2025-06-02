import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001"); // Cambia esta IP por la de tu backend

function Login() {
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Puedes definir la IP manualmente aquí, o luego obtenerla dinámicamente
    const ipCliente = "172.17.38.25"; // Ejemplo de IP que envías manualmente

    const handleLogin = (e) => {
        e.preventDefault();
        setError(null);

        socket.emit("login", { nombreUsuario, contraseña, ip: ipCliente }, (response) => {
            if (response.success) {
                localStorage.setItem("usuario", nombreUsuario);
                navigate("/chat");
            } else {
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
