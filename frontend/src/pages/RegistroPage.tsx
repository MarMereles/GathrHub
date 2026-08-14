import { Link } from "react-router-dom";
import Registro from "../components/login/Registro";

function RegistroPage() {
  return (
    <div>
      <div className="page-header">
        <h2>Crear cuenta</h2>
      </div>
      <Registro />
      <p>
        ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión acá</Link>
      </p>
    </div>
  );
}

export default RegistroPage;