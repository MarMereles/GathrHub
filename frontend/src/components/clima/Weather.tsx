import { useState } from "react";
import axios from "axios";
import type { WeatherData } from "../../types/WeatherData";

function Weather() {
  const [ciudad, setCiudad] = useState("Asuncion");
  const [clima, setClima] = useState<WeatherData | null>(null);
  //Para el manejo de carga y de errores
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const buscarClima = async () => {
    if (!ciudad) {
      setError("Ingresá una ciudad");
      return;
    }

    setCargando(true);
    setError("");
    setClima(null);

    const token = localStorage.getItem("token");

    try {
      const respuesta = await axios.get(
        `http://localhost:4000/api/clima?ciudad=${ciudad}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setClima(respuesta.data);
    } catch (err) {
      console.log(err);
      setError("No se encontró la ciudad. Probá con otro nombre.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="salon-form">
      <label>
        Ciudad
        <br />
        <input
          type="text"
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
        />
      </label>
      <br />
      <br />

      <button onClick={buscarClima} disabled={cargando}>
        {cargando ? "Buscando..." : "Buscar clima"}
      </button>

      {error && <p className="error-msg">{error}</p>}

      {clima && (
        <div className="clima-card">
          <h3>{clima.ciudad}</h3>
          <p>Departamento: {clima.departamento}</p>
          <hr />
          <p>🌡 Temperatura: {clima.current.temperature_2m} °C</p>
          <p>💧 Humedad: {clima.current.relative_humidity_2m} %</p>
          <p>💨 Viento: {clima.current.wind_speed_10m} km/h</p>
          <p>🌧️ Probabilidad:{clima.current.precipitation_probability}%</p>
        </div>
      )}
    </div>
  );
}
export default Weather;
