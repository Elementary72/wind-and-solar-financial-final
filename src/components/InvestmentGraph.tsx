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
import { FinancialResults } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface InvestmentGraphProps {
  data: FinancialResults;
}

const InvestmentGraph: React.FC<InvestmentGraphProps> = ({ data }) => {
  const years = Array.from({ length: data.cumulativeCashFlows.length }, (_, i) => `Year ${i}`);
  
  // Find the payback year (first year with positive cumulative cash flow)
  const paybackYear = data.cumulativeCashFlows.findIndex((value, index) => index > 0 && value >= 0);
  
  // Create background colors array to highlight negative period in red
  const backgroundColors = years.map((_, index) => {
    if (index === 0 || (index <= paybackYear && paybackYear !== -1)) {
      return 'rgba(239, 68, 68, 0.2)'; // Red for negative period
    }
    return 'rgba(16, 185, 129, 0.2)'; // Green for positive period
  });
  
  // Create border colors array
  const borderColors = years.map((_, index) => {
    if (index === 0 || (index <= paybackYear && paybackYear !== -1)) {
      return 'rgba(239, 68, 68, 1)'; // Red for negative period
    }
    return 'rgba(16, 185, 129, 1)'; // Green for positive period
  });
  
  const chartData = {
    labels: years,
    datasets: [
      {
        label: 'Cumulative Cash Flow',
        data: data.cumulativeCashFlows,
        fill: true,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 2,
        pointBackgroundColor: borderColors,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: borderColors,
        segment: {
          borderColor: (ctx: any) => {
            if (ctx.p0.parsed.y < 0 && ctx.p1.parsed.y < 0) {
              return 'rgba(239, 68, 68, 1)'; // Red for negative segments
            }
            return 'rgba(16, 185, 129, 1)'; // Green for positive segments
          }
        }
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
        text: 'Investment Analysis',
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
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
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
        grid: {
          color: (context) => {
            if (context.tick.value === 0) {
              return 'rgba(0, 0, 0, 0.5)'; // Darker line for zero
            }
            return 'rgba(0, 0, 0, 0.1)';
          },
          lineWidth: (context) => {
            if (context.tick.value === 0) {
              return 2; // Thicker line for zero
            }
            return 1;
          }
        },
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('en-ZA', {
              style: 'currency',
              currency: 'ZAR',
              notation: 'compact',
              compactDisplay: 'short'
            }).format(value as number);
          }
        }
      }
    }
  };
  
  return (
    <div>
      <div className="mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Investment Period</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span className="text-sm text-gray-600">Return Period</span>
          </div>
        </div>
      </div>
      <div className="bg-white p-2 rounded-lg">
        <Line data={chartData} options={options} />
      </div>
      <div className="mt-4 text-sm text-gray-600">
        <p>Payback Period: <span className="font-semibold">{data.paybackPeriod.toFixed(1)} years</span></p>
        <p>Initial Investment: <span className="font-semibold">
          {new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR'
          }).format(data.initialInvestment)}
        </span></p>
      </div>
    </div>
  );
};

export default InvestmentGraph;