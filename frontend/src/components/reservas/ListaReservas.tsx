import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import type { Reserva } from "../../types/Reserva";

function ListaReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:4000/api/reservas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setReservas(res.data))
      .catch((error) => console.log(error));
  }, []);

  const eliminar = async (id: number) => {
    const confirmar = window.confirm(
      "¿Seguro que querés eliminar esta reserva?",
    );
    if (!confirmar) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:4000/api/reservas/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReservas((prev) => prev.filter((reserva) => reserva.id !== id));
    } catch (error) {
      console.log(error);
      alert("No se pudo eliminar la reserva");
    }
  };

  return (
    <div>
      <ul>
        {reservas.map((reserva) => (
          <li key={reserva.id}>
            {/* reserva.salon y reserva.usuario vienen incluidos gracias
                al "include" del backend (relación entre tablas) */}
            <strong>{reserva.salon.nombre}</strong> reservado por{" "}
            {reserva.usuario.nombre} — {reserva.fecha.slice(0, 10)} de{" "}
            {reserva.horaInicio} a {reserva.horaFin} — Estado: {reserva.estado}
            {reserva.notas && <> — Notas: {reserva.notas}</>}{" "}
            <Link to={`/reservas/editar/${reserva.id}`}>Editar</Link>{" "}
            <button onClick={() => eliminar(reserva.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaReservas;
