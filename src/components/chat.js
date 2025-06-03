import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import {
    ChatContainer,
    UIMensajes,
    LiMensaje,
    InputBox,
    InputMensaje,
    BotonEnviar
} from "../ui-components";

function Chat() {
    const [socket, setSocket] = useState(null);
    const socketRef = useRef(null);

    const [isConnected, setIsConnected] = useState(false);
    const [isTryingToConnect, setIsTryingToConnect] = useState(false);

    const [nuevoMensaje, setNuevoMensaje] = useState("");
    const [mensajes, setMensajes] = useState([]);

    const [usuarioNombre] = useState(localStorage.getItem("usuario"));
    const navigate = useNavigate();

    const listaIPs = useRef([]); // 🔹 Aquí se guardan las IPs una vez cargadas

    // Cargar IPs de servidores al montar
    useEffect(() => {
        const cargarServidores = async () => {
            try {
                const res = await fetch("http://192.168.1.176:3001/usuarios/ips");
                const data = await res.json();
                listaIPs.current = data;

                console.log("📡 IPs cargadas:", listaIPs.current);

                intentarConectar();
            } catch (err) {
                console.error("Error al cargar IPs de servidores:", err);
            }
        };
        cargarServidores();

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    // Función para intentar conectar a los servidores usando las IPs almacenadas
    const intentarConectar = (index = 0) => {
        const servidores = listaIPs.current;

        if (index >= servidores.length) {
            console.error("❌ No se pudo conectar a ningún servidor.");
            setIsTryingToConnect(false);
            setIsConnected(false);
            setSocket(null);
            return;
        }

        setIsTryingToConnect(true);

        const socketTemp = io(servidores[index], {
            reconnectionAttempts: 3,
            timeout: 3000
        });

        socketTemp.on("connect", async () => {
            console.log(`✅ Conectado a ${servidores[index]}`);
            setIsConnected(true);
            setSocket(socketTemp);
            socketRef.current = socketTemp;
            setIsTryingToConnect(false);

            // Escuchar mensajes en tiempo real
            socketTemp.on("chat_message", (data) => {
                if (!data || !data.mensaje || !data.usuario || !data._id) return;

                setMensajes((mensajes) => {
                    // Evitar duplicados por _id
                    if (mensajes.find(m => m._id === data._id)) {
                        return mensajes;
                    }
                    return [...mensajes, data];
                });
            });

            // Cargar historial de mensajes
            try {
                const res = await fetch(`${servidores[index]}/mensajes`);
                const data = await res.json();
                if (data.success) {
                    setMensajes(data.mensajes);
                }
            } catch (err) {
                console.error("Error cargando mensajes del historial:", err);
            }
        });

        socketTemp.on("connect_error", () => {
            console.warn(`⚠️ Fallo al conectar con ${servidores[index]}`);
            socketTemp.close();
            setIsConnected(false);
            setSocket(null);
            intentarConectar(index + 1);
        });

        socketTemp.on("disconnect", () => {
            console.warn("🔌 Desconectado del servidor");
            setIsConnected(false);
            setSocket(null);
            setMensajes([]);
        });
    };

    // Función para reconectar manualmente
    const reconectarSocket = () => {
        if (socketRef.current) {
            socketRef.current.disconnect();
        }
        setIsTryingToConnect(true);
        setTimeout(() => {
            intentarConectar();
        }, 3000);
    };

    const enviarMensaje = () => {
        if (socket && isConnected && nuevoMensaje.trim() !== "") {
            socket.emit("enviar_mensaje", {
                usuario: usuarioNombre,
                mensaje: nuevoMensaje,
                chatId: 1
            });
            setNuevoMensaje("");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("usuario");
        navigate("/");
    };

    const handleShutdown = async () => {
        if (!socketRef.current) return;
        try {
            const res = await fetch(`${socketRef.current.io.uri}/shutdown`, {
                method: "POST"
            });
            const data = await res.json();
            alert(data.mensaje || "Servidor detenido");

            setIsConnected(false);
            setIsTryingToConnect(true);
            setSocket(null);
            socketRef.current.disconnect();

            setTimeout(() => {
                intentarConectar();
            }, 5000);
        } catch (err) {
            alert("Error al intentar apagar el servidor.");
            console.error(err);
        }
    };

    return (
        <ChatContainer>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <div>
                    <button onClick={handleLogout} style={{ marginRight: 10 }}>Logout</button>
                    <button onClick={handleShutdown} disabled={!isConnected}>Shutdown</button>
                </div>
                <h2>{isConnected ? "🟢 Conectado" : isTryingToConnect ? "🟡 Conectando..." : "🔴 No conectado"}</h2>
            </div>

            {!isConnected && !isTryingToConnect && (
                <button onClick={reconectarSocket}>🔄 Reintentar conexión</button>
            )}

            <UIMensajes>
                {mensajes.map((mensaje) => (
                    <LiMensaje key={mensaje._id} isOwn={mensaje.usuario === usuarioNombre}>
                        <strong>{mensaje.usuario === usuarioNombre ? "Tú" : mensaje.usuario}</strong>: {mensaje.mensaje}
                    </LiMensaje>
                ))}
            </UIMensajes>

            <InputBox>
                <InputMensaje
                    type="text"
                    value={nuevoMensaje}
                    onChange={(e) => setNuevoMensaje(e.target.value)}
                    placeholder="Escribe tu mensaje"
                />
                <BotonEnviar onClick={enviarMensaje} disabled={!isConnected || nuevoMensaje.trim() === ""}>
                    Enviar
                </BotonEnviar>
            </InputBox>
        </ChatContainer>
    );
}

export default Chat;
