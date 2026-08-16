export interface WeatherData {
  ciudad: string;
  departamento: string;

  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    precipitation_probability: number;
  };
}
