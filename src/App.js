import './App.css';
import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import { LiMensaje, UIMensajes } from './ui-components';

const servidores = [
  "http://192.168.1.162:3001", // Servidor 1
  "http://192.168.1.145:3001", // Servidor 2 (backup)
  // puedes agregar más servidores aquí
];

function App() {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);

  useEffect(() => {
    let conectado = false;
    let nuevoSocket = null;

    const intentarConectar = async (index = 0) => {
      if (index >= servidores.length) {
        console.error("No se pudo conectar a ningún servidor.");
        return;
      }

      nuevoSocket = io(servidores[index], {
        reconnectionAttempts: 3,
        timeout: 3000
      });

      nuevoSocket.on("connect", () => {
        setIsConnected(true);
        setSocket(nuevoSocket);
        conectado = true;

        nuevoSocket.on("chat_message", (data) => {
          setMensajes((mensajes) => [...mensajes, data]);
        });
      });

      nuevoSocket.on("connect_error", () => {
        console.warn(`Fallo al conectar con ${servidores[index]}`);
        nuevoSocket.close();
        if (!conectado) intentarConectar(index + 1);
      });

      nuevoSocket.on("disconnect", () => {
        setIsConnected(false);
        setSocket(null);
        setMensajes([]);
        console.warn("Servidor desconectado");

        // Recargar la ventana al desconectarse
        window.location.reload();
      });
    };

    intentarConectar();

    return () => {
      if (nuevoSocket) {
        nuevoSocket.disconnect();
      }
    };
  }, []);

  const enviarMensaje = () => {
    if (socket && isConnected) {
      socket.emit("chat_message", {
        usuario: socket.id,
        mensaje: nuevoMensaje
      });
      setNuevoMensaje(""); // limpiar input
    }
  };

  return (
    <div className="App">
      <h2>{isConnected ? "Conectado" : "No conectado"}</h2>
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
        onChange={e => setNuevoMensaje(e.target.value)}
      />
      <button onClick={enviarMensaje} disabled={!isConnected}>
        Enviar
      </button>
    </div>
  );
}

export default App;