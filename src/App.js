import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/login";
import Chat from "./components/chat";

function PrivateRoute({ children }) {
  const usuario = localStorage.getItem("usuario");
  return usuario ? children : <Navigate to="/" replace />;
}

function App() {
  const usuario = localStorage.getItem("usuario");

  return (
    <Routes>
      {/* Si ya hay usuario en localStorage, redirige al chat, sino muestra login */}
      <Route 
        path="/" 
        element={usuario ? <Navigate to="/chat" replace /> : <Login />} 
      />
      {/* Solo permite acceder a chat si hay usuario, sino redirige a login */}
      <Route 
        path="/chat" 
        element={
          <PrivateRoute>
            <Chat />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
}

export default App;
