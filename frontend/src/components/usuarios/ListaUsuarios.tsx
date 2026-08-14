import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import type { Usuario } from "../../types/Usuario";

function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:4000/api/usuarios", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setUsuarios(res.data))
      .catch((error) => console.log(error));
  }, []);

  const eliminar = async (id: number) => {
    const confirmar = window.confirm(
      "¿Seguro que querés eliminar este usuario? También se eliminan sus reservas.",
    );
    if (!confirmar) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:4000/api/usuarios/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsuarios((prev) => prev.filter((usuario) => usuario.id !== id));
    } catch (error) {
      console.log(error);
      alert("No se pudo eliminar el usuario");
    }
  };

  return (
    <div>
      <ul>
        {usuarios.map((usuario) => (
          <li key={usuario.id}>
            {usuario.nombre} — {usuario.correo}{" "}
            {usuario.telefono ? `— ${usuario.telefono}` : ""}{" "}
            <Link to={`/usuarios/editar/${usuario.id}`}>Editar</Link>{" "}
            <button onClick={() => eliminar(usuario.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaUsuarios;
