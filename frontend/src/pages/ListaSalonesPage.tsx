import { Link } from "react-router-dom";
import ListaSalones from "../components/salones/ListaSalones";

function ListaSalonesPage() {
  return (
    <div>
      <div className="page-header">
        <h2>Salones disponibles</h2>
        <Link to="/salones/crear" className="btn-nuevo">
          + Nuevo salón
        </Link>
      </div>
      <ListaSalones />
    </div>
  );
}

export default ListaSalonesPage;