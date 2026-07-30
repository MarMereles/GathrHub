import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditarSalon() {
  // useParams funciona igual acá adentro que en una página: lee el ":id"
  // de la URL sin importar en qué nivel del árbol de componentes esté.
  const { id } = useParams();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [capacidad, setCapacidad] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [precioPorHora, setPrecioPorHora] = useState("");
  const [disponible, setDisponible] = useState(true);
  const [imagenUrl, setImagenUrl] = useState("");

  // Al montar el componente, buscamos el salón por su id y precargamos el formulario
  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/salones/${id}`)
      .then((res) => {
        const salon = res.data;
        setNombre(salon.nombre);
        setDescripcion(salon.descripcion);
        setCapacidad(String(salon.capacidad));
        setUbicacion(salon.ubicacion);
        setPrecioPorHora(String(salon.precioPorHora));
        setDisponible(salon.disponible);
        setImagenUrl(salon.imagenUrl ?? "");
      })
      .catch((error) => console.log(error));
  }, [id]);

  const guardar = async () => {
    if (!nombre || !descripcion || !capacidad || !ubicacion || !precioPorHora) {
      alert("Por favor completá todos los campos obligatorios");
      return;
    }

    await axios.put(`http://localhost:4000/api/salones/${id}`, {
      nombre,
      descripcion,
      capacidad: Number(capacidad),
      ubicacion,
      precioPorHora: Number(precioPorHora),
      disponible,
      imagenUrl: imagenUrl || null,
    });

    alert("Salón actualizado");
    navigate("/salones");
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

      <button onClick={guardar}>Guardar cambios</button>
    </div>
  );
}

export default EditarSalon;
