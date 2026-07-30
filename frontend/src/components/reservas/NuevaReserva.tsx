import { useEffect, useState } from "react";
import axios from "axios";
import type { Salon } from "../../types/Salon";
import type { Usuario } from "../../types/Usuario";
import type { EstadoReserva } from "../../types/Reserva";

function NuevaReserva() {
  const [salones, setSalones] = useState<Salon[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const [salonId, setSalonId] = useState("");
  const [usuarioId, setUsuarioId] = useState("");
  const [fecha, setFecha] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [estado, setEstado] = useState<EstadoReserva>("pendiente");
  const [notas, setNotas] = useState("");

  // Cargamos las opciones para los <select> de salón y usuario
  useEffect(() => {
    axios
      .get("http://localhost:4000/api/salones")
      .then((res) => setSalones(res.data))
      .catch((error) => console.log(error));

    axios
      .get("http://localhost:4000/api/usuarios")
      .then((res) => setUsuarios(res.data))
      .catch((error) => console.log(error));
  }, []);

  const guardar = async () => {
    if (!salonId || !usuarioId || !fecha || !horaInicio || !horaFin) {
      alert("Completá salón, usuario, fecha, hora de inicio y hora de fin");
      return;
    }

    try {
      await axios.post("http://localhost:4000/api/reservas", {
        salonId: Number(salonId),
        usuarioId: Number(usuarioId),
        fecha,
        horaInicio,
        horaFin,
        estado,
        notas: notas || null,
      });

      alert("Reserva creada");

      setSalonId("");
      setUsuarioId("");
      setFecha("");
      setHoraInicio("");
      setHoraFin("");
      setEstado("pendiente");
      setNotas("");
    } catch (error) {
      console.log(error);
      const axiosError = error as { response?: { data?: { error?: string } } };
      // El backend devuelve, por ejemplo, un 409 si hay conflicto de horario
      alert(axiosError.response?.data?.error || "Ocurrió un error al guardar la reserva");
    }
  };

  return (
    <div className="salon-form">
      <label>
        Salón
        <br />
        <select value={salonId} onChange={(e) => setSalonId(e.target.value)}>
          <option value="">-- Seleccioná un salón --</option>
          {salones.map((salon) => (
            <option key={salon.id} value={salon.id}>
              {salon.nombre}
            </option>
          ))}
        </select>
      </label>
      <br />
      <br />

      <label>
        Usuario
        <br />
        <select value={usuarioId} onChange={(e) => setUsuarioId(e.target.value)}>
          <option value="">-- Seleccioná un usuario --</option>
          {usuarios.map((usuario) => (
            <option key={usuario.id} value={usuario.id}>
              {usuario.nombre} ({usuario.correo})
            </option>
          ))}
        </select>
      </label>
      <br />
      <br />

      <label>
        Fecha
        <br />
        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
      </label>
      <br />
      <br />

      <label>
        Hora de inicio
        <br />
        <input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />
      </label>
      <br />
      <br />

      <label>
        Hora de fin
        <br />
        <input type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} />
      </label>
      <br />
      <br />

      <label>
        Estado
        <br />
        <select value={estado} onChange={(e) => setEstado(e.target.value as EstadoReserva)}>
          <option value="pendiente">Pendiente</option>
          <option value="confirmada">Confirmada</option>
          <option value="cancelada">Cancelada</option>
        </select>
      </label>
      <br />
      <br />

      <textarea
        placeholder="Notas (opcional)"
        value={notas}
        onChange={(e) => setNotas(e.target.value)}
      />
      <br />
      <br />

      <button onClick={guardar}>Reservar</button>
    </div>
  );
}

export default NuevaReserva;
