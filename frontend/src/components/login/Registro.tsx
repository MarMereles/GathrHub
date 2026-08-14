import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Registro() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");

  const registrar = async () => {
    if (!nombre || !correo || !password) {
      alert("Completá nombre, correo y contraseña");
      return;
    }
    try {
      const respuesta = await axios.post(
        "http://localhost:4000/api/auth/registro",
        {
          nombre,
          correo,
          telefono: telefono || null,
          password,
        },
      );
      alert("Registro exitoso.");
      localStorage.setItem("token", respuesta.data.token);
      localStorage.setItem("usuario", JSON.stringify(respuesta.data.usuario));
      navigate("/salones");
    } catch (error) {
      console.log(error);
      const axiosError = error as { response?: { data?: { error?: string } } };
      alert(
        axiosError.response?.data?.error || "Ocurrió un error al registrarse",
      );
    }
  };

  return (
    <div className="salon-form">
      <input
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <br />

      <input
        placeholder="Correo"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
      />
      <br />

      <input
        type="password"
        placeholder="Contraseña (mínimo 6 caracteres)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />

      <input
        placeholder="Teléfono (opcional)"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
      />
      <br />
      <br />

      <button onClick={registrar}>Crear cuenta</button>
    </div>
  );
}

export default Registro;
