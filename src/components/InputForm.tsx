import React from 'react';
import { useForm } from 'react-hook-form';
import { InputData } from '../types';

interface InputFormProps {
  onSubmit: (data: InputData) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm<InputData>({
    defaultValues: {
      // System Parameters
      systemSize: 10,
      dailyProductionHours: 5.5,
      gridEmissionFactor: 0.95,
      operationalLifetime: 25,
      costPerKW: 15000,
      installationCost: 20000,
      degradationRate: 0.5,
      operationalCosts: 5000,
      
      // Financial Parameters
      electricityPrice: 2.20,
      electricityPriceIncrease: 8,
      financingYears: 10,
      interestRate: 7.5,
      inflationRate: 5,
      discountRate: 8,
    }
  });

  const onFormSubmit = (data: InputData) => {
    onSubmit(data);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Input Parameters</h2>
      
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* System Parameters Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700 border-b pb-2">System Parameters</h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                System Size (kW)
              </label>
              <input
                type="number"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-md ${errors.systemSize ? 'border-red-500' : 'border-gray-300'}`}
                {...register('systemSize', { required: true, min: 0.1 })}
              />
              {errors.systemSize && <p className="text-red-500 text-xs mt-1">Valid system size is required</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Daily Production Hours
              </label>
              <input
                type="number"
                step="0.1"
                className={`w-full px-3 py-2 border rounded-md ${errors.dailyProductionHours ? 'border-red-500' : 'border-gray-300'}`}
                {...register('dailyProductionHours', { required: true, min: 0.1, max: 24 })}
              />
              {errors.dailyProductionHours && <p className="text-red-500 text-xs mt-1">Valid production hours required (0.1-24)</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Grid Emission Factor (kg CO₂/kWh)
              </label>
              <input
                type="number"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-md ${errors.gridEmissionFactor ? 'border-red-500' : 'border-gray-300'}`}
                {...register('gridEmissionFactor', { required: true, min: 0 })}
              />
              {errors.gridEmissionFactor && <p className="text-red-500 text-xs mt-1">Valid emission factor required</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Operational Lifetime (years)
              </label>
              <input
                type="number"
                className={`w-full px-3 py-2 border rounded-md ${errors.operationalLifetime ? 'border-red-500' : 'border-gray-300'}`}
                {...register('operationalLifetime', { required: true, min: 1, max: 50 })}
              />
              {errors.operationalLifetime && <p className="text-red-500 text-xs mt-1">Valid lifetime required (1-50 years)</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cost per kW (R)
              </label>
              <input
                type="number"
                step="100"
                className={`w-full px-3 py-2 border rounded-md ${errors.costPerKW ? 'border-red-500' : 'border-gray-300'}`}
                {...register('costPerKW', { required: true, min: 0 })}
              />
              {errors.costPerKW && <p className="text-red-500 text-xs mt-1">Valid cost per kW required</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Installation Cost (R)
              </label>
              <input
                type="number"
                step="1000"
                className={`w-full px-3 py-2 border rounded-md ${errors.installationCost ? 'border-red-500' : 'border-gray-300'}`}
                {...register('installationCost', { required: true, min: 0 })}
              />
              {errors.installationCost && <p className="text-red-500 text-xs mt-1">Valid installation cost required</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Degradation Rate (% per year)
              </label>
              <input
                type="number"
                step="0.1"
                className={`w-full px-3 py-2 border rounded-md ${errors.degradationRate ? 'border-red-500' : 'border-gray-300'}`}
                {...register('degradationRate', { required: true, min: 0, max: 10 })}
              />
              {errors.degradationRate && <p className="text-red-500 text-xs mt-1">Valid degradation rate required (0-10%)</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Operational Costs (R per year)
              </label>
              <input
                type="number"
                step="100"
                className={`w-full px-3 py-2 border rounded-md ${errors.operationalCosts ? 'border-red-500' : 'border-gray-300'}`}
                {...register('operationalCosts', { required: true, min: 0 })}
              />
              {errors.operationalCosts && <p className="text-red-500 text-xs mt-1">Valid operational costs required</p>}
            </div>
          </div>
        </div>
        
        {/* Financial Parameters Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Financial Parameters</h3>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Electricity Price (R per kWh)
              </label>
              <input
                type="number"
                step="0.01"
                className={`w-full px-3 py-2 border rounded-md ${errors.electricityPrice ? 'border-red-500' : 'border-gray-300'}`}
                {...register('electricityPrice', { required: true, min: 0.01 })}
              />
              {errors.electricityPrice && <p className="text-red-500 text-xs mt-1">Valid electricity price required</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Electricity Price Increase (% per year)
              </label>
              <input
                type="number"
                step="0.1"
                className={`w-full px-3 py-2 border rounded-md ${errors.electricityPriceIncrease ? 'border-red-500' : 'border-gray-300'}`}
                {...register('electricityPriceIncrease', { required: true, min: 0 })}
              />
              {errors.electricityPriceIncrease && <p className="text-red-500 text-xs mt-1">Valid price increase required</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Financing Years
              </label>
              <input
                type="number"
                className={`w-full px-3 py-2 border rounded-md ${errors.financingYears ? 'border-red-500' : 'border-gray-300'}`}
                {...register('financingYears', { required: true, min: 0, max: 30 })}
              />
              {errors.financingYears && <p className="text-red-500 text-xs mt-1">Valid financing period required (0-30 years)</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interest Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                className={`w-full px-3 py-2 border rounded-md ${errors.interestRate ? 'border-red-500' : 'border-gray-300'}`}
                {...register('interestRate', { required: true, min: 0 })}
              />
              {errors.interestRate && <p className="text-red-500 text-xs mt-1">Valid interest rate required</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Inflation Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                className={`w-full px-3 py-2 border rounded-md ${errors.inflationRate ? 'border-red-500' : 'border-gray-300'}`}
                {...register('inflationRate', { required: true, min: 0 })}
              />
              {errors.inflationRate && <p className="text-red-500 text-xs mt-1">Valid inflation rate required</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                className={`w-full px-3 py-2 border rounded-md ${errors.discountRate ? 'border-red-500' : 'border-gray-300'}`}
                {...register('discountRate', { required: true, min: 0 })}
              />
              {errors.discountRate && <p className="text-red-500 text-xs mt-1">Valid discount rate required</p>}
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Calculate Results
        </button>
      </form>
    </div>
  );
};

export default InputForm;