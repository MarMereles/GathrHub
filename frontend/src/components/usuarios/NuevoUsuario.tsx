import { useState } from "react";
import axios from "axios";

function NuevoUsuario() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");

  const guardar = async () => {
    if (!nombre || !correo) {
      alert("Por favor completá nombre y correo");
      return;
    }

    try {
      await axios.post("http://localhost:4000/api/usuarios", {
        nombre,
        correo,
        telefono: telefono || null,
      });

      alert("Usuario creado");

      setNombre("");
      setCorreo("");
      setTelefono("");
    } catch (error) {
      console.log(error);
      const axiosError = error as { response?: { data?: { error?: string } } };
      alert(axiosError.response?.data?.error || "Ocurrió un error al guardar el usuario");
    }
  };

  return (
    <div className="salon-form">
      <input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      <br />

      <input placeholder="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} />
      <br />

      <input
        placeholder="Teléfono (opcional)"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
      />
      <br />
      <br />

      <button onClick={guardar}>Guardar</button>
    </div>
  );
}

export default NuevoUsuario;
