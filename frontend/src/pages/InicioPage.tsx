import { Link } from "react-router-dom";

function InicioPage() {
return (
    <div>
      <h2>Bienvenido a GathrHub</h2>
      <p>El hub de tus reservas</p>
      <p>Elegí una opción:</p>
      <ul>
        <li><Link to="/salones">Ver salones disponibles</Link></li>
        <li><Link to="/login">Iniciar sesión</Link></li>
        <li><Link to="/registro">Registrarse</Link></li>
      </ul>
    </div>
  );
}

export default InicioPage;