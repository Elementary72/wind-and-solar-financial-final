import React, { useState } from 'react';
import { Download, Wind, Sun } from 'lucide-react';
import InputForm from './components/InputForm';
import FinancialMetrics from './components/FinancialMetrics';
import InvestmentGraph from './components/InvestmentGraph';
import EnergyGenerationTable from './components/EnergyGenerationTable';
import CarbonReductionEstimation from './components/CarbonReductionEstimation';
import ElectricityPricePrediction from './components/ElectricityPricePrediction';
import { calculateFinancialMetrics, calculateCarbonReduction, predictElectricityPrices, calculateEnergyGeneration } from './utils/calculations';
import { generatePDF } from './utils/pdfGenerator';
import { InputData, FinancialResults, CarbonResults, EnergyResults, ElectricityPriceResults } from './types';

function App() {
  const [financialResults, setFinancialResults] = useState<FinancialResults | null>(null);
  const [carbonResults, setCarbonResults] = useState<CarbonResults | null>(null);
  const [energyResults, setEnergyResults] = useState<EnergyResults | null>(null);
  const [electricityPriceResults, setElectricityPriceResults] = useState<ElectricityPriceResults | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = (data: InputData) => {
    // Calculate all metrics
    const financialMetrics = calculateFinancialMetrics(data);
    const carbonReduction = calculateCarbonReduction(data);
    const energyGeneration = calculateEnergyGeneration(data);
    const electricityPrices = predictElectricityPrices(data);

    // Update state with results
    setFinancialResults(financialMetrics);
    setCarbonResults(carbonReduction);
    setEnergyResults(energyGeneration);
    setElectricityPriceResults(electricityPrices);
    setShowResults(true);
  };

  const handleDownloadPDF = () => {
    if (financialResults && carbonResults && energyResults && electricityPriceResults) {
      generatePDF(financialResults, carbonResults, energyResults, electricityPriceResults);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-r from-blue-600 to-green-500 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sun className="h-8 w-8" />
              <Wind className="h-8 w-8" />
              <h1 className="text-2xl md:text-3xl font-bold">Solar & Wind Financial Analysis</h1>
            </div>
            {showResults && (
              <button 
                onClick={handleDownloadPDF}
                className="flex items-center space-x-2 bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg shadow transition-colors"
              >
                <Download className="h-5 w-5" />
                <span>Download PDF</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <InputForm onSubmit={handleSubmit} />
          </div>

          {showResults && (
            <div className="lg:col-span-8 space-y-8">
              {financialResults && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Financial Metrics</h2>
                  <FinancialMetrics data={financialResults} />
                </div>
              )}

              {financialResults && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Investment Analysis</h2>
                  <InvestmentGraph data={financialResults} />
                </div>
              )}

              {electricityPriceResults && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Electricity Price Prediction</h2>
                  <ElectricityPricePrediction data={electricityPriceResults} />
                </div>
              )}

              {energyResults && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Energy Generation Prediction</h2>
                  <EnergyGenerationTable data={energyResults} />
                </div>
              )}

              {carbonResults && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Carbon Reduction Estimation</h2>
                  <CarbonReductionEstimation data={carbonResults} />
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Solar & Wind Financial Analysis Tool</p>
        </div>
      </footer>
    </div>
  );
}

export default App;