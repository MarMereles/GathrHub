import Weather from "../components/clima/Weather";

function WeatherPage() {
  return (
    <div className="container mt-4">
      <h1 className="page-title">Consulta Meteorológica</h1>
      <hr />
      <Weather />
    </div>
  );
}
export default WeatherPage;
