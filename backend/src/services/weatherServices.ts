import axios from "axios";

// Consulta el clima actual de una ciudad usando la API pública Open-Meteo.
// Son dos pasos: primero convertir el nombre de la ciudad en coordenadas
// (geocoding), y después pedir el clima para esas coordenadas.
export const obtenerClima = async (ciudad: string) => {
  // Paso 1: buscar la ciudad para obtener latitud/longitud
  const geo = await axios.get(
    "https://geocoding-api.open-meteo.com/v1/search",
    {
      params: {
        name: ciudad,
        countryCode: "PY",
        count: 1,
      },
    },
  );
  if (!geo.data.results || geo.data.results.length === 0) {
    throw new Error("Ciudad no encontrada");
  }
  //aqui se guarda la long y lat
  const lugar = geo.data.results[0];

  // Paso 2: pedir el clima actual para esas coordenadas
  const clima = await axios.get("https://api.open-meteo.com/v1/forecast", {
    params: {
      latitude: lugar.latitude,
      longitude: lugar.longitude,
      current: "temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation_probability", 
    },
  });

  return {
    ciudad: lugar.name,
    departamento: lugar.admin1,
    ...clima.data,
  }; //todo esto devuelve una respuesta json
};
