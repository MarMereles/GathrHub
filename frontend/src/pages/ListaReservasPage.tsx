import { Link } from "react-router-dom";
import ListaReservas from "../components/reservas/ListaReservas";

function ListaReservasPage() {
  return (
    <div>
      <div className="page-header">
        <h2>Reservas</h2>
        <Link to="/reservas/crear" className="btn-nuevo">
          + Nueva reserva
        </Link>
      </div>
      <ListaReservas />
    </div>
  );
}

export default ListaReservasPage;
