import { Link } from "react-router-dom";

function InicioPage() {
  return (
    <div>
      <h2>Bienvenido a GathrHub</h2>
      <p>Elegí qué querés gestionar:</p>
      <ul>
        <li>
          <Link to="/salones">Ver salones</Link>
        </li>
        <li>
          <Link to="/usuarios">Ver usuarios</Link>
        </li>
        <li>
          <Link to="/reservas">Ver reservas</Link>
        </li>
      </ul>
    </div>
  );
}

export default InicioPage;
