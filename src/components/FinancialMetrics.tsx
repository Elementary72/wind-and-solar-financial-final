import React from 'react';
import { FinancialResults } from '../types';

interface FinancialMetricsProps {
  data: FinancialResults;
}

const FinancialMetrics: React.FC<FinancialMetricsProps> = ({ data }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const getStatusColor = (metric: string, value: number) => {
    switch (metric) {
      case 'npv':
        return value > 0 ? 'text-green-600' : 'text-red-600';
      case 'irr':
        return value > 8 ? 'text-green-600' : value > 0 ? 'text-yellow-600' : 'text-red-600';
      case 'paybackPeriod':
        return value < 10 ? 'text-green-600' : value < 15 ? 'text-yellow-600' : 'text-red-600';
      case 'roi':
        return value > 100 ? 'text-green-600' : value > 0 ? 'text-yellow-600' : 'text-red-600';
      case 'lcoe':
        return value < 1 ? 'text-green-600' : value < 2 ? 'text-yellow-600' : 'text-red-600';
      default:
        return 'text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Net Present Value (NPV)</h3>
        <p className={`text-xl font-bold ${getStatusColor('npv', data.npv)}`}>
          {formatCurrency(data.npv)}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {data.npv > 0 ? 'Financially viable project' : 'Project may not be financially viable'}
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Internal Rate of Return (IRR)</h3>
        <p className={`text-xl font-bold ${getStatusColor('irr', data.irr)}`}>
          {data.irr.toFixed(2)}%
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {data.irr > 8 ? 'Excellent return' : data.irr > 0 ? 'Positive return' : 'Negative return'}
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Payback Period</h3>
        <p className={`text-xl font-bold ${getStatusColor('paybackPeriod', data.paybackPeriod)}`}>
          {data.paybackPeriod.toFixed(1)} years
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {data.paybackPeriod < 10 ? 'Quick payback' : data.paybackPeriod < 15 ? 'Average payback' : 'Long payback'}
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Return on Investment (ROI)</h3>
        <p className={`text-xl font-bold ${getStatusColor('roi', data.roi)}`}>
          {data.roi.toFixed(2)}%
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {data.roi > 100 ? 'Excellent ROI' : data.roi > 0 ? 'Positive ROI' : 'Negative ROI'}
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Levelized Cost of Energy (LCOE)</h3>
        <p className={`text-xl font-bold ${getStatusColor('lcoe', data.lcoe)}`}>
          {formatCurrency(data.lcoe)}/kWh
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {data.lcoe < 1 ? 'Very competitive' : data.lcoe < 2 ? 'Competitive' : 'High cost'}
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-sm font-medium text-gray-500 mb-1">Initial Investment</h3>
        <p className="text-xl font-bold text-gray-800">
          {formatCurrency(data.initialInvestment)}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Total upfront cost
        </p>
      </div>
    </div>
  );
};

export default FinancialMetrics;