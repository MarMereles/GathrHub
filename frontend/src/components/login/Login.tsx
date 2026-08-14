import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");

  const ingresar = async () => {

    if (!correo || !password) {
      alert("Completá correo y contraseña");
      return;
    }

    try {
      const respuesta = await axios.post(
        "http://localhost:4000/api/auth/login",
        {
          correo,
          password,
        },
      );

      localStorage.setItem("token", respuesta.data.token);
      localStorage.setItem("usuario", JSON.stringify(respuesta.data.usuario));
      navigate("/salones");

    } catch (error) {
      console.log(error);
      const axiosError = error as { response?: { data?: { error?: string } } };
      alert(
        axiosError.response?.data?.error ||
          "Ocurrió un error al iniciar sesión",
      );
    }
  };

  return (
    <div className="salon-form">
      <input
        placeholder="Correo"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
      />
      <br />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <br />

      <button onClick={ingresar}>Ingresar</button>
    </div>
  );
}
export default Login;
