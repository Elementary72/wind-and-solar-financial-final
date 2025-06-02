import React from 'react';
import { Line } from 'react-chartjs-2';
import { MLPrediction } from '../types';

interface MLPredictionDisplayProps {
  predictions: MLPrediction[];
  actualValues?: number[];
}

const MLPredictionDisplay: React.FC<MLPredictionDisplayProps> = ({ predictions, actualValues }) => {
  const data = {
    labels: predictions.map((_, index) => `Hour ${index + 1}`),
    datasets: [
      {
        label: 'Predicted Output',
        data: predictions.map(p => p.predictedOutput),
        borderColor: 'rgb(75, 192, 192)',
        fill: false
      },
      ...(actualValues ? [{
        label: 'Actual Output',
        data: actualValues,
        borderColor: 'rgb(255, 99, 132)',
        fill: false
      }] : [])
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Power Output Prediction'
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const prediction = predictions[context.dataIndex];
            return `${context.dataset.label}: ${context.parsed.y.toFixed(2)} kW (Confidence: ${(prediction.confidence * 100).toFixed(1)}%)`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Power Output (kW)'
        }
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">ML Predictions</h3>
      <Line data={data} options={options} />
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-700">Average Confidence</h4>
          <p className="text-2xl font-bold text-blue-900">
            {(predictions.reduce((acc, p) => acc + p.confidence, 0) / predictions.length * 100).toFixed(1)}%
          </p>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-green-700">Peak Output</h4>
          <p className="text-2xl font-bold text-green-900">
            {Math.max(...predictions.map(p => p.predictedOutput)).toFixed(2)} kW
          </p>
        </div>
      </div>
    </div>
  );
};

export default MLPredictionDisplay;