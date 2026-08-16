import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import ListaSalonesPage from "./pages/ListaSalonesPage";
import NuevoSalonPage from "./pages/NuevoSalonPage";
import EditarSalonPage from "./pages/EditarSalonPage";
import ListaUsuariosPage from "./pages/ListaUsuariosPage";
import EditarUsuarioPage from "./pages/EditarUsuarioPage";
import ListaReservasPage from "./pages/ListaReservasPage";
import NuevaReservaPage from "./pages/NuevaReservaPage";
import EditarReservaPage from "./pages/EditarReservaPage";
import LoginPage from "./pages/LoginPage";
import RegistroPage from "./pages/RegistroPage";
import ProtectedRoute from "./components/login/ProtectedRoute";
import "./App.css";
import WeatherPage from "./pages/WeatherPage";

function NavBar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Si no hay token, no mostramos la barra de navegación
  if (!token) {
    return null;
  }

  return (
    <nav className="app-nav">
      {usuario.nombre && (
        <span className="nav-usuario">👤 {usuario.nombre}</span>
      )}

      <a href="/salones">Salones</a>
      <a href="/usuarios">Usuarios</a>
      <a href="/reservas">Reservas</a>

      <button  className="btn-clima" onClick={() => navigate ("/clima")}>
        Consultar clima
      </button>

      <button className="btn-logout" onClick={cerrarSesion}>
        Cerrar sesión
      </button>
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <header className="app-header">
          <h1>GathrHub</h1>
          <p>- El hub de tus reservas -</p>
        </header>

        <NavBar />

        <main>
          <Routes>
            {/* Rutas públicas (no requieren token) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegistroPage />} />

            {/* Ruta raíz: redirige según token */}
            <Route
              path="/"
              element={
                localStorage.getItem("token") ? (
                  <Navigate to="/salones" />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Ruta pública de listado de salones (porque GET /api/salones no requiere token) */}
            <Route path="/salones" element={<ListaSalonesPage />} />

            {/* Rutas protegidas (requieren token) */}
            <Route
              path="/salones/crear"
              element={
                <ProtectedRoute>
                  <NuevoSalonPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/salones/editar/:id"
              element={
                <ProtectedRoute>
                  <EditarSalonPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/usuarios"
              element={
                <ProtectedRoute>
                  <ListaUsuariosPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/usuarios/editar/:id"
              element={
                <ProtectedRoute>
                  <EditarUsuarioPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/reservas"
              element={
                <ProtectedRoute>
                  <ListaReservasPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reservas/crear"
              element={
                <ProtectedRoute>
                  <NuevaReservaPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reservas/editar/:id"
              element={
                <ProtectedRoute>
                  <EditarReservaPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/clima"
              element={
                <ProtectedRoute>
                  <WeatherPage />
                </ProtectedRoute>
              }
            />

            {/* Ruta 404 */}
            <Route path="*" element={<h2>Página no encontrada</h2>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
