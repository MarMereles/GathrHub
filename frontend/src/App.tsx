import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import InicioPage from "./pages/InicioPage";
import ListaSalonesPage from "./pages/ListaSalonesPage";
import NuevoSalonPage from "./pages/NuevoSalonPage";
import EditarSalonPage from "./pages/EditarSalonPage";
import ListaUsuariosPage from "./pages/ListaUsuariosPage";
import NuevoUsuarioPage from "./pages/NuevoUsuarioPage";
import EditarUsuarioPage from "./pages/EditarUsuarioPage";
import ListaReservasPage from "./pages/ListaReservasPage"
import NuevaReservaPage from "./pages/NuevaReservaPage";
import EditarReservaPage from "./pages/EditarReservaPage";
import "./App.css";


function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <header className="app-header">
          <h1>GathrHub</h1>
          <p>- El hub de tus reservas -</p>
        </header>

        <nav className="app-nav">
          <Link to="/">Inicio</Link>
          <Link to="/salones">Salones</Link>
          <Link to="/usuarios">Usuarios</Link>
          <Link to="/reservas">Reservas</Link>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<InicioPage />} />

            <Route path="/salones" element={<ListaSalonesPage />} />
            <Route path="/salones/crear" element={<NuevoSalonPage />} />
            <Route path="/salones/editar/:id" element={<EditarSalonPage />} />

            <Route path="/usuarios" element={<ListaUsuariosPage />} />
            <Route path="/usuarios/crear" element={<NuevoUsuarioPage />} />
            <Route path="/usuarios/editar/:id" element={<EditarUsuarioPage />} />

            <Route path="/reservas" element={<ListaReservasPage />} />
            <Route path="/reservas/crear" element={<NuevaReservaPage />} />
            <Route path="/reservas/editar/:id" element={<EditarReservaPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
