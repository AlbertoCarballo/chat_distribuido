import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

function Registro() {
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [correo, setCorreo] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [error, setError] = useState(null);
    const [socket, setSocket] = useState(null);
    const navigate = useNavigate();

    const ipCliente = "192.168.1.176";

    useEffect(() => {
        // Crear conexión socket al montar el componente
        const newSocket = io("http://192.168.1.176:3001");
        setSocket(newSocket);

        // Al desmontar el componente, desconectamos el socket para limpiar recursos
        return () => {
            newSocket.disconnect();
        };
    }, []);

    const handleRegistro = (e) => {
        e.preventDefault();
        setError(null);

        if (!socket) {
            setError("No hay conexión con el servidor.");
            return;
        }

        socket.emit(
            "registrar",
            { nombreUsuario, correo, contraseña, ip: ipCliente },
            (response) => {
                if (response.success) {
                    alert("✅ Registro exitoso. Ahora puedes iniciar sesión.");
                    socket.disconnect(); // Desconectar tras éxito
                    navigate("/");
                } else {
                    setError(response.mensaje || "Error al registrar");
                }
            }
        );
    };

    return (
        <form onSubmit={handleRegistro} style={{ maxWidth: 300, margin: "auto", marginTop: 50 }}>
            <h2>Registro</h2>
            <input
                type="text"
                placeholder="Nombre de usuario"
                value={nombreUsuario}
                onChange={(e) => setNombreUsuario(e.target.value)}
                required
                style={{ width: "100%", marginBottom: 10, padding: 8 }}
            />
            <input
                type="email"
                placeholder="Correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
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
            <button type="submit" style={{ width: "100%", padding: 10, marginBottom: 10 }}>
                Registrarse
            </button>
            <button
                type="button"
                onClick={() => navigate("/")}
                style={{ width: "100%", padding: 10, backgroundColor: "#ccc" }}
            >
                Volver al login
            </button>
        </form>
    );
}

export default Registro;
