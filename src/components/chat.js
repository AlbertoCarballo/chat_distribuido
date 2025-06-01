import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { LiMensaje, UIMensajes } from "../ui-components";

function Chat() {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [nuevoMensaje, setNuevoMensaje] = useState("");
    const [mensajes, setMensajes] = useState([]);
    const [servidores, setServidores] = useState([]);

    // 🔄 Cargar IPs dinámicamente desde el backend
    useEffect(() => {
        const cargarServidores = async () => {
            try {
                const res = await fetch("http://localhost:3001/usuarios/ips");
                const data = await res.json();
                setServidores(data);
            } catch (err) {
                console.error("Error al cargar IPs de servidores:", err);
            }
        };

        cargarServidores();
    }, []);

    // 🔌 Intentar conectarse a un servidor de la lista
    useEffect(() => {
        if (servidores.length === 0) return;

        let conectado = false;
        let nuevoSocket = null;

        const intentarConectar = async (index = 0) => {
            if (index >= servidores.length) {
                console.error("❌ No se pudo conectar a ningún servidor.");
                return;
            }

            nuevoSocket = io(servidores[index], {
                reconnectionAttempts: 3,
                timeout: 3000
            });

            nuevoSocket.on("connect", () => {
                console.log(`✅ Conectado a ${servidores[index]}`);
                setIsConnected(true);
                setSocket(nuevoSocket);
                conectado = true;

                nuevoSocket.on("chat_message", (data) => {
                    setMensajes((mensajes) => [...mensajes, data]);
                });
            });

            nuevoSocket.on("connect_error", () => {
                console.warn(`⚠️ Fallo al conectar con ${servidores[index]}`);
                nuevoSocket.close();
                if (!conectado) intentarConectar(index + 1);
            });

            nuevoSocket.on("disconnect", () => {
                console.warn("🔌 Desconectado del servidor");
                setIsConnected(false);
                setSocket(null);
                setMensajes([]);
                window.location.reload();
            });
        };

        intentarConectar();

        return () => {
            if (nuevoSocket) nuevoSocket.disconnect();
        };
    }, [servidores]);

    // ✉️ Enviar mensaje
    const enviarMensaje = () => {
        if (socket && isConnected && nuevoMensaje.trim() !== "") {
            socket.emit("chat_message", {
                usuario: socket.id,
                mensaje: nuevoMensaje
            });
            setNuevoMensaje("");
        }
    };

    return (
        <div className="chat-container">
            <h2>{isConnected ? "🟢 Conectado" : "🔴 No conectado"}</h2>
            <UIMensajes>
                {mensajes.map((mensaje, index) => (
                    <LiMensaje key={index}>
                        {mensaje.usuario}: {mensaje.mensaje}
                    </LiMensaje>
                ))}
            </UIMensajes>
            <input
                type="text"
                value={nuevoMensaje}
                onChange={(e) => setNuevoMensaje(e.target.value)}
                placeholder="Escribe tu mensaje"
            />
            <button onClick={enviarMensaje} disabled={!isConnected || nuevoMensaje.trim() === ""}>
                Enviar
            </button>
        </div>
    );
}

export default Chat;
