import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import {
    SignUpContainer,
    SignUpBox,
    SignUpTitle,
    SignUpInput,
    SignUpButton,
    RegisterButton,
    ErrorText
} from '../signup-ui-components';

function Registro() {
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [correo, setCorreo] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [error, setError] = useState(null);
    const [socket, setSocket] = useState(null);
    const navigate = useNavigate();

    const ipCliente = "192.168.1.66";

    useEffect(() => {
        // Crear conexión socket al montar el componente
        const newSocket = io("http://192.168.1.66:3001");
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
        <SignUpContainer>
            <SignUpBox>
                <SignUpTitle>Registro</SignUpTitle>

                <form onSubmit={handleRegistro} style={{ display: "flex", flexDirection: "column", gap: "15px"  }}>
                    <SignUpInput
                        type="text"
                        placeholder="Nombre de usuario"
                        value={nombreUsuario}
                        onChange={(e) => setNombreUsuario(e.target.value)}
                        required
                        
                    />
                    <SignUpInput
                        type="email"
                        placeholder="Correo"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        required
                    />
                    <SignUpInput
                        type="password"
                        placeholder="Contraseña"
                        value={contraseña}
                        onChange={(e) => setContraseña(e.target.value)}
                        required
                    />
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <SignUpButton type="submit">
                        Registrarse
                    </SignUpButton>
                    <RegisterButton
                        type="button"
                        onClick={() => navigate("/")}
                    >
                        Volver al login
                    </RegisterButton>
                </form>
            </SignUpBox>

        </SignUpContainer>
    );
}

export default Registro;
