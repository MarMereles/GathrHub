import { Link } from "react-router-dom";
import Login from "../components/login/Login";

function LoginPage() {
  return (
    <div>
      <div className="page-header">
        <h2>Iniciar sesión</h2>
      </div>
      <Login />
      <p>
        ¿No tenés cuenta? <Link to="/registro">Registrate acá</Link>
      </p>
    </div>
  );
}

export default LoginPage;