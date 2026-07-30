import { Link } from "react-router-dom";
import ListaUsuarios from "../components/usuarios/ListaUsuarios";

function ListaUsuariosPage() {
  return (
    <div>
      <div className="page-header">
        <h2>Usuarios registrados</h2>
        <Link to="/usuarios/crear" className="btn-nuevo">
          + Nuevo usuario
        </Link>
      </div>
      <ListaUsuarios />
    </div>
  );
}

export default ListaUsuariosPage;