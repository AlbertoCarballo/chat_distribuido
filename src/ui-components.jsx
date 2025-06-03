import styled from "styled-components";

// Contenedor principal del chat
const ChatContainer = styled.div`
  max-width: 900px;
  height: 80vh; /* altura para que ocupe buena parte de la pantalla */
  margin: 40px auto;
  padding: 30px 20px;
  background-color: #f1f3f5;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  font-family: 'Poppins', sans-serif;
`;


// Lista de mensajes
const UIMensajes = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;

  flex-grow: 1;  /* que ocupe todo el espacio vertical posible */
  overflow-y: auto;
  padding: 10px 0;
  margin-bottom: 20px; /* espacio abajo antes del input */
`;


// Estilo de cada mensaje
const LiMensaje = styled.li`
  background-color: ${({ isOwn }) => (isOwn ? "#d1e7dd" : "#e7f1ff")};
  border: 1px solid ${({ isOwn }) => (isOwn ? "#a3cfbb" : "#b6d4fe")};
  align-self: ${({ isOwn }) => (isOwn ? "flex-end" : "flex-start")};
  min-width: 30%;
  max-width: 70%;
  padding: 12px 18px;
  border-radius: 16px;
  font-size: 15px;
  color: #212529;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.07);

  strong {
    display: block;
    font-weight: 600;
    margin-bottom: 4px;
    color: #343a40;
  }
`;

// Contenedor del input y botón
const InputBox = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;


// Campo de texto para escribir mensajes
const InputMensaje = styled.input`
  flex: 1;
  padding: 12px 16px;
  border-radius: 12px;
  border: 1px solid #ced4da;
  font-size: 15px;
  font-family: 'Poppins', sans-serif;
  outline: none;
  transition: border 0.2s ease-in-out;

  &:focus {
    border-color: #339af0;
  }
`;

// Botón de enviar
const BotonEnviar = styled.button`
  background-color: #339af0;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  font-size: 15px;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #1c7ed6;
  }

  &:disabled {
    background-color: #adb5bd;
    cursor: not-allowed;
  }
`;

const LogoutButton = styled.button`
  background-color: #339af0;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  font-size: 15px;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color:rgb(241, 219, 12);
    color: black;
  }
`;

const ShutdownButton = styled.button`
  background-color: #339af0;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 20px;
  margin-left: 10px;
  font-size: 15px;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color:rgb(214, 28, 28);
    color: black;
  }
`;

export {
  ChatContainer,
  UIMensajes,
  LiMensaje,
  InputBox,
  InputMensaje,
  BotonEnviar,
  LogoutButton,
  ShutdownButton
};
