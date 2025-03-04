import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { ElectricityPriceResults } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ElectricityPricePredictionProps {
  data: ElectricityPriceResults;
}

const ElectricityPricePrediction: React.FC<ElectricityPricePredictionProps> = ({ data }) => {
  const chartData = {
    labels: data.years.map(year => `Year ${year}`),
    datasets: [
      {
        label: 'Electricity Price (R/kWh)',
        data: data.prices,
        fill: false,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1
      }
    ]
  };
  
  const options: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Electricity Price Forecast',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-ZA', {
                style: 'currency',
                currency: 'ZAR',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Price (R/kWh)'
        },
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('en-ZA', {
              style: 'currency',
              currency: 'ZAR',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }).format(value as number);
          }
        }
      },
      x: {
        title: {
          display: true,
          text: 'Year'
        }
      }
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="bg-white p-2 rounded-lg">
        <Line data={chartData} options={options} />
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-md font-medium text-blue-700 mb-2">Price Forecast Insights</h3>
        <p className="text-sm text-gray-700">
          Starting at <span className="font-semibold">
            {new Intl.NumberFormat('en-ZA', {
              style: 'currency',
              currency: 'ZAR',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }).format(data.prices[0])}
          </span> per kWh, electricity prices are projected to increase by {data.prices[0] !== 0 ? ((data.prices[data.prices.length - 1] / data.prices[0] - 1) * 100).toFixed(0) : 0}% over {data.years.length} years.
        </p>
        <p className="text-sm text-gray-700 mt-2">
          By year {data.years.length}, the price is expected to reach <span className="font-semibold">
            {new Intl.NumberFormat('en-ZA', {
              style: 'currency',
              currency: 'ZAR',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            }).format(data.prices[data.prices.length - 1])}
          </span> per kWh.
        </p>
        <p className="text-sm text-gray-700 mt-2">
          This forecast is based on an annual increase rate of {((data.prices[1] / data.prices[0] - 1) * 100).toFixed(1)}%.
        </p>
      </div>
    </div>
  );
};

export default ElectricityPricePrediction;