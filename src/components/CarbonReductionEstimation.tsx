import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { CarbonResults } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CarbonReductionEstimationProps {
  data: CarbonResults;
}

const CarbonReductionEstimation: React.FC<CarbonReductionEstimationProps> = ({ data }) => {
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-ZA', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Prepare chart data
  const chartData = {
    labels: ['Solar/Wind', 'Coal'],
    datasets: [
      {
        label: 'CO₂ Emissions (kg) per kWh',
        data: [data.gridEmissionFactor, data.comparisonWithCoal],
        backgroundColor: [
          'rgba(16, 185, 129, 0.6)', // Green for renewable
          'rgba(239, 68, 68, 0.6)'   // Red for coal
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Carbon Emissions Comparison',
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
              label += formatNumber(context.parsed.y) + ' kg CO₂/kWh';
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'CO₂ Emissions (kg per kWh)'
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Daily Reduction</h3>
          <p className="text-xl font-bold text-green-600">
            {formatNumber(data.dailyReduction)} kg CO₂
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {formatCurrency(data.dailyReduction / 1000 * 190)} value
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Yearly Reduction</h3>
          <p className="text-xl font-bold text-green-600">
            {formatNumber(data.yearlyReduction)} kg CO₂
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {formatCurrency(data.yearlyReduction / 1000 * 190)} value
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Lifetime Reduction</h3>
          <p className="text-xl font-bold text-green-600">
            {formatNumber(data.lifetimeReduction)} kg CO₂
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {formatCurrency(data.carbonValue)} value
          </p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg">
        <Bar data={chartData} options={options} />
      </div>

      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h3 className="text-md font-medium text-green-700 mb-2">Environmental Impact</h3>
        <p className="text-sm text-gray-700">
          This renewable energy system will prevent approximately <span className="font-semibold">{formatNumber(data.lifetimeReduction)}</span> kg 
          of CO₂ emissions over its lifetime, equivalent to:
        </p>
        <ul className="mt-2 space-y-1 text-sm text-gray-700">
          <li>• Planting approximately {formatNumber(data.lifetimeReduction / 21)} trees</li>
          <li>• Taking {formatNumber(data.lifetimeReduction / 4600)} cars off the road for a year</li>
          <li>• Avoiding {formatNumber(data.lifetimeReduction / 1000)} tons of coal being burned</li>
        </ul>
      </div>
    </div>
  );
};

export default CarbonReductionEstimation;