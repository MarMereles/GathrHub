import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditarUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:4000/api/usuarios/${id}`)
      .then((res) => {
        const usuario = res.data;
        setNombre(usuario.nombre);
        setCorreo(usuario.correo);
        setTelefono(usuario.telefono ?? "");
      })
      .catch((error) => console.log(error));
  }, [id]);

  const guardar = async () => {
    if (!nombre || !correo) {
      alert("Por favor completá nombre y correo");
      return;
    }

    try {
      await axios.put(`http://localhost:4000/api/usuarios/${id}`, {
        nombre,
        correo,
        telefono: telefono || null,
      });

      alert("Usuario actualizado");
      navigate("/usuarios");
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

      <button onClick={guardar}>Guardar cambios</button>
    </div>
  );
}

export default EditarUsuario;
