import { useState } from "react";
import axios from "axios";

function NuevoSalon() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [capacidad, setCapacidad] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [precioPorHora, setPrecioPorHora] = useState("");
  const [disponible, setDisponible] = useState(true);
  const [imagenUrl, setImagenUrl] = useState("");

  const guardar = async () => {
    if (!nombre || !descripcion || !capacidad || !ubicacion || !precioPorHora) {
      alert("Por favor completá todos los campos obligatorios");
      return;
    }

    await axios.post("http://localhost:4000/api/salones", {
      nombre,
      descripcion,
      capacidad: Number(capacidad),
      ubicacion,
      precioPorHora: Number(precioPorHora),
      disponible,
      imagenUrl: imagenUrl || null,
    });

    alert("Salón creado");

    setNombre("");
    setDescripcion("");
    setCapacidad("");
    setUbicacion("");
    setPrecioPorHora("");
    setDisponible(true);
    setImagenUrl("");
  };

  return (
    <div className="salon-form">
      <input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      <br />

      <textarea
        placeholder="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
      />
      <br />

      <input
        type="number"
        placeholder="Capacidad"
        value={capacidad}
        onChange={(e) => setCapacidad(e.target.value)}
      />
      <br />

      <input placeholder="Ubicación" value={ubicacion} onChange={(e) => setUbicacion(e.target.value)} />
      <br />

      <input
        type="number"
        placeholder="Precio por hora"
        value={precioPorHora}
        onChange={(e) => setPrecioPorHora(e.target.value)}
      />
      <br />

      <input
        placeholder="URL de imagen (opcional)"
        value={imagenUrl}
        onChange={(e) => setImagenUrl(e.target.value)}
      />
      <br />

      <label>
        <input
          type="checkbox"
          checked={disponible}
          onChange={(e) => setDisponible(e.target.checked)}
        />
        Disponible para reservas
      </label>
      <br />
      <br />

      <button onClick={guardar}>Guardar</button>
    </div>
  );
}

export default NuevoSalon;
