import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import {
    LoginContainer,
    LoginBox,
    LoginTitle,
    LoginInput,
    LoginButton,
    RegisterButton,
    ErrorText
} from '../login-ui-components'

function Login() {
    const [nombreUsuario, setNombreUsuario] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const socketRef = useRef(null);

    const ipCliente = "192.168.1.66";

    useEffect(() => {
        // Crear la conexión socket al montar el componente
        socketRef.current = io("http://192.168.1.66:3001");

        // Limpiar el socket al desmontar
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();
        setError(null);

        if (!socketRef.current) {
            setError("No hay conexión con el servidor.");
            return;
        }

        socketRef.current.emit(
            "login",
            { nombreUsuario, contraseña, ip: ipCliente },
            (response) => {
                if (response.success) {
                    localStorage.setItem("usuario", nombreUsuario);
                    // Desconectamos el socket porque ya no lo necesitamos aquí
                    socketRef.current.disconnect();
                    navigate("/chat");
                } else {
                    setError(response.mensaje);
                }
            }
        );
    };

    const irARegistro = () => {
        navigate("/registro");
    };

    return (
        <LoginContainer>
            <LoginBox>
                <LoginTitle>Iniciar Sesión</LoginTitle>
                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    <LoginInput
                        type="text"
                        placeholder="Nombre de usuario"
                        value={nombreUsuario}
                        onChange={(e) => setNombreUsuario(e.target.value)}
                        required
                    />
                    <LoginInput
                        type="password"
                        placeholder="Contraseña"
                        value={contraseña}
                        onChange={(e) => setContraseña(e.target.value)}
                        required
                    />
                    {error && <ErrorText>{error}</ErrorText>}
                    <LoginButton type="submit">Entrar</LoginButton>
                </form>
                <RegisterButton type="button" onClick={irARegistro}>
                    Registrarse
                </RegisterButton>
            </LoginBox>
        </LoginContainer>
    );
}

export default Login;
