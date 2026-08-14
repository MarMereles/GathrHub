import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import type { Salon } from "../../types/Salon";
import type { Usuario } from "../../types/Usuario";
import type { EstadoReserva } from "../../types/Reserva";

// Convierte una fecha ISO ("2026-08-01T00:00:00.000Z") al formato que
// espera un <input type="date"> ("2026-08-01")
const aFechaInput = (fechaIso: string) => fechaIso.slice(0, 10);

function EditarReserva() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [salones, setSalones] = useState<Salon[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const [salonId, setSalonId] = useState("");
  const [usuarioId, setUsuarioId] = useState("");
  const [fecha, setFecha] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [estado, setEstado] = useState<EstadoReserva>("pendiente");
  const [notas, setNotas] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:4000/api/salones", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setSalones(res.data))
      .catch((error) => console.log(error));

    axios
      .get("http://localhost:4000/api/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsuarios(res.data))
      .catch((error) => console.log(error));
  }, []);

  // Se busca la reserva actual y precargamos el formulario
  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:4000/api/reservas/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const reserva = res.data;
        setSalonId(String(reserva.salonId));
        setUsuarioId(String(reserva.usuarioId));
        setFecha(aFechaInput(reserva.fecha));
        setHoraInicio(reserva.horaInicio);
        setHoraFin(reserva.horaFin);
        setEstado(reserva.estado);
        setNotas(reserva.notas ?? "");
      })
      .catch((error) => console.log(error));
  }, [id]);

  const guardar = async () => {
    if (!salonId || !usuarioId || !fecha || !horaInicio || !horaFin) {
      alert(
        "Completa los campos salón, usuario, fecha, hora de inicio y hora de fin",
      );
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:4000/api/reservas/${id}`,
        {
          salonId: Number(salonId),
          usuarioId: Number(usuarioId),
          fecha,
          horaInicio,
          horaFin,
          estado,
          notas: notas || null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert("Reserva actualizada");
      navigate("/reservas");
    } catch (error) {
      console.log(error);
      const axiosError = error as { response?: { data?: { error?: string } } };
      alert(
        axiosError.response?.data?.error ||
          "Ocurrió un error al guardar la reserva",
      );
    }
  };

  return (
    <div className="salon-form">
      <label>
        Salón
        <br />
        <select value={salonId} onChange={(e) => setSalonId(e.target.value)}>
          <option value="">-- Selecciona un salón --</option>
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
        <select
          value={usuarioId}
          onChange={(e) => setUsuarioId(e.target.value)}
        >
          <option value="">-- Selecciona un usuario --</option>
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
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
      </label>
      <br />
      <br />

      <label>
        Hora de inicio
        <br />
        <input
          type="time"
          value={horaInicio}
          onChange={(e) => setHoraInicio(e.target.value)}
        />
      </label>
      <br />
      <br />

      <label>
        Hora de fin
        <br />
        <input
          type="time"
          value={horaFin}
          onChange={(e) => setHoraFin(e.target.value)}
        />
      </label>
      <br />
      <br />

      <label>
        Estado
        <br />
        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value as EstadoReserva)}
        >
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

      <button onClick={guardar}>Guardar cambios</button>
    </div>
  );
}

export default EditarReserva;
