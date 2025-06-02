import React from 'react';
import { Line } from 'react-chartjs-2';
import { WeatherData } from '../types';

interface WeatherDataDisplayProps {
  data: WeatherData;
}

const WeatherDataDisplay: React.FC<WeatherDataDisplayProps> = ({ data }) => {
  const temperatureData = {
    labels: data.hourly.time.map(time => new Date(time).toLocaleString()),
    datasets: [
      {
        label: 'Temperature (2m)',
        data: data.hourly.temperature_2m,
        borderColor: 'rgb(255, 99, 132)',
        fill: false
      }
    ]
  };

  const windSpeedData = {
    labels: data.hourly.time.map(time => new Date(time).toLocaleString()),
    datasets: [
      {
        label: 'Wind Speed (10m)',
        data: data.hourly.wind_speed_10m,
        borderColor: 'rgb(54, 162, 235)',
        fill: false
      },
      {
        label: 'Wind Speed (80m)',
        data: data.hourly.wind_speed_80m,
        borderColor: 'rgb(75, 192, 192)',
        fill: false
      }
    ]
  };

  const solarData = {
    labels: data.hourly.time.map(time => new Date(time).toLocaleString()),
    datasets: [
      {
        label: 'Direct Normal Irradiance',
        data: data.hourly.direct_normal_irradiance,
        borderColor: 'rgb(255, 159, 64)',
        fill: false
      },
      {
        label: 'Diffuse Radiation',
        data: data.hourly.diffuse_radiation,
        borderColor: 'rgb(153, 102, 255)',
        fill: false
      }
    ]
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Temperature</h3>
        <Line data={temperatureData} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Wind Speed</h3>
        <Line data={windSpeedData} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Solar Radiation</h3>
        <Line data={solarData} />
      </div>
    </div>
  );
};

export default WeatherDataDisplay;