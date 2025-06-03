import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login";
import Chat from "./components/chat";
import Registro from "./components/Registro"; // <-- Nuevo import

function PrivateRoute({ children }) {
  const usuario = localStorage.getItem("usuario");
  return usuario ? children : <Navigate to="/" replace />;
}

function App() {
  const usuario = localStorage.getItem("usuario");

  return (
    <Routes>
      {/* Login principal */}
      <Route
        path="/"
        element={usuario ? <Navigate to="/chat" replace /> : <Login />}
      />

      {/* Ruta de registro accesible para todos */}
      <Route path="/registro" element={<Registro />} />

      {/* Chat protegido */}
      <Route
        path="/chat"
        element={
          <PrivateRoute>
            <Chat />
          </PrivateRoute>
        }
      />

      {/* Ruta por defecto (fallback) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
