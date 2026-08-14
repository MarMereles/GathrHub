import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import type { Salon } from "../../types/Salon";

function ListaSalones() {
  const [salones, setSalones] = useState<Salon[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/salones")
      .then((res) => setSalones(res.data))
      .catch((error) => console.log(error));
  }, []);

  const eliminar = async (id: number) => {
    const confirmar = window.confirm(
      "¿Seguro que querés eliminar este salón? También se eliminan sus reservas.",
    );
    if (!confirmar) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:4000/api/salones/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSalones((prev) => prev.filter((salon) => salon.id !== id));
    } catch (error) {
      console.log(error);
      alert("No se pudo eliminar el salón");
    }
  };

  return (
    <div>
      <ul>
        {salones.map((salon) => (
          <li key={salon.id}>
            {salon.nombre} — {salon.ubicacion} — Capacidad: {salon.capacidad} —
            Gs. {salon.precioPorHora} / hora —{" "}
            {salon.disponible ? "Disponible" : "No disponible"}{" "}
            <Link to={`/salones/editar/${salon.id}`}>Editar</Link>{" "}
            <button onClick={() => eliminar(salon.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaSalones;
