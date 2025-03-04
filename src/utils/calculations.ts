import { InputData, FinancialResults, CarbonResults, EnergyResults, ElectricityPriceResults } from '../types';

// Calculate financial metrics
export function calculateFinancialMetrics(data: InputData): FinancialResults {
  const {
    systemSize,
    dailyProductionHours,
    costPerKW,
    installationCost,
    operationalLifetime,
    electricityPrice,
    electricityPriceIncrease,
    operationalCosts,
    degradationRate,
    financingYears,
    interestRate,
    discountRate,
  } = data;

  // Calculate initial investment
  const initialInvestment = systemSize * costPerKW + installationCost;
  
  // Calculate annual energy production (kWh)
  const annualProduction = systemSize * dailyProductionHours * 365;
  
  // Calculate yearly cash flows
  const yearlyCashFlows: number[] = [];
  const cumulativeCashFlows: number[] = [];
  
  let cumulativeCashFlow = -initialInvestment;
  cumulativeCashFlows.push(cumulativeCashFlow);
  
  // Calculate loan payments if financing is used
  const monthlyInterestRate = interestRate / 100 / 12;
  const totalPayments = financingYears * 12;
  const monthlyPayment = financingYears > 0 && interestRate > 0 
    ? (initialInvestment * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, totalPayments)) / 
      (Math.pow(1 + monthlyInterestRate, totalPayments) - 1)
    : initialInvestment / (financingYears * 12);
  const annualLoanPayment = monthlyPayment * 12;
  
  // Calculate yearly cash flows
  for (let year = 1; year <= operationalLifetime; year++) {
    // Calculate degraded production
    const degradationFactor = Math.pow(1 - degradationRate / 100, year - 1);
    const yearlyProduction = annualProduction * degradationFactor;
    
    // Calculate electricity price with yearly increase
    const adjustedElectricityPrice = electricityPrice * Math.pow(1 + electricityPriceIncrease / 100, year - 1);
    
    // Calculate yearly revenue
    const yearlyRevenue = yearlyProduction * adjustedElectricityPrice;
    
    // Calculate yearly costs
    const yearlyOperationalCosts = operationalCosts * Math.pow(1 + data.inflationRate / 100, year - 1);
    
    // Calculate loan payment (only for financing years)
    const yearlyLoanPayment = year <= financingYears ? annualLoanPayment : 0;
    
    // Calculate net cash flow
    const yearlyCashFlow = yearlyRevenue - yearlyOperationalCosts - yearlyLoanPayment;
    yearlyCashFlows.push(yearlyCashFlow);
    
    // Update cumulative cash flow
    cumulativeCashFlow += yearlyCashFlow;
    cumulativeCashFlows.push(cumulativeCashFlow);
  }
  
  // Calculate NPV
  const npv = calculateNPV(yearlyCashFlows, discountRate / 100, initialInvestment);
  
  // Calculate IRR
  const irr = calculateIRR(yearlyCashFlows, initialInvestment);
  
  // Calculate payback period
  const paybackPeriod = calculatePaybackPeriod(cumulativeCashFlows);
  
  // Calculate ROI
  const totalRevenue = yearlyCashFlows.reduce((sum, cashFlow) => sum + cashFlow, 0);
  const roi = (totalRevenue / initialInvestment) * 100;
  
  // Calculate LCOE
  const totalLifetimeEnergy = calculateTotalLifetimeEnergy(annualProduction, degradationRate, operationalLifetime);
  const totalLifetimeCosts = initialInvestment + operationalCosts * operationalLifetime;
  const lcoe = totalLifetimeCosts / totalLifetimeEnergy;
  
  return {
    npv,
    irr,
    paybackPeriod,
    roi,
    lcoe,
    yearlyCashFlows,
    cumulativeCashFlows,
    initialInvestment,
  };
}

// Calculate carbon reduction
export function calculateCarbonReduction(data: InputData): CarbonResults {
  const { systemSize, dailyProductionHours, gridEmissionFactor, operationalLifetime } = data;
  
  // Calculate daily energy production (kWh)
  const dailyProduction = systemSize * dailyProductionHours;
  
  // Calculate daily carbon reduction (kg CO2)
  const dailyReduction = dailyProduction * gridEmissionFactor;
  
  // Calculate yearly carbon reduction (kg CO2)
  const yearlyReduction = dailyReduction * 365;
  
  // Calculate lifetime carbon reduction (kg CO2)
  const lifetimeReduction = yearlyReduction * operationalLifetime;
  
  // Calculate carbon value (R)
  const carbonValue = (lifetimeReduction / 1000) * 190; // R190 per ton of CO2
  
  // Calculate yearly values for the graph
  const yearlyValues = Array.from({ length: operationalLifetime }, (_, i) => yearlyReduction);
  
  // Calculate comparison with coal (assuming coal emits 1kg CO2 per kWh)
  const comparisonWithCoal = lifetimeReduction / (dailyProduction * 365 * operationalLifetime);
  
  return {
    dailyReduction,
    yearlyReduction,
    lifetimeReduction,
    carbonValue,
    yearlyValues,
    comparisonWithCoal,
  };
}

// Calculate energy generation
export function calculateEnergyGeneration(data: InputData): EnergyResults {
  const { systemSize, dailyProductionHours, operationalLifetime, degradationRate } = data;
  
  // Calculate daily output (kWh)
  const dailyOutput = systemSize * dailyProductionHours;
  
  // Calculate monthly output (kWh) - simplified, assuming equal production each month
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const monthlyOutput = daysInMonth.map(days => dailyOutput * days);
  
  // Calculate yearly output with degradation (kWh)
  const yearlyOutput = Array.from({ length: operationalLifetime }, (_, year) => {
    const degradationFactor = Math.pow(1 - degradationRate / 100, year);
    return dailyOutput * 365 * degradationFactor;
  });
  
  // Calculate total lifetime output (kWh)
  const totalLifetimeOutput = yearlyOutput.reduce((sum, output) => sum + output, 0);
  
  return {
    dailyOutput,
    monthlyOutput,
    yearlyOutput,
    totalLifetimeOutput,
  };
}

// Predict electricity prices
export function predictElectricityPrices(data: InputData): ElectricityPriceResults {
  const { electricityPrice, electricityPriceIncrease, operationalLifetime } = data;
  
  const years = Array.from({ length: operationalLifetime }, (_, i) => i + 1);
  const prices = years.map(year => 
    electricityPrice * Math.pow(1 + electricityPriceIncrease / 100, year - 1)
  );
  
  return {
    years,
    prices,
  };
}

// Helper functions
function calculateNPV(cashFlows: number[], discountRate: number, initialInvestment: number): number {
  let npv = -initialInvestment;
  
  for (let i = 0; i < cashFlows.length; i++) {
    npv += cashFlows[i] / Math.pow(1 + discountRate, i + 1);
  }
  
  return npv;
}

function calculateIRR(cashFlows: number[], initialInvestment: number): number {
  // Simple IRR approximation using bisection method
  let lowerRate = -0.99;
  let upperRate = 1;
  let guess = (lowerRate + upperRate) / 2;
  let guessNPV = 0;
  
  for (let iteration = 0; iteration < 100; iteration++) {
    guessNPV = -initialInvestment;
    
    for (let i = 0; i < cashFlows.length; i++) {
      guessNPV += cashFlows[i] / Math.pow(1 + guess, i + 1);
    }
    
    if (Math.abs(guessNPV) < 0.001) break;
    
    if (guessNPV > 0) {
      lowerRate = guess;
    } else {
      upperRate = guess;
    }
    
    guess = (lowerRate + upperRate) / 2;
  }
  
  return guess * 100; // Convert to percentage
}

function calculatePaybackPeriod(cumulativeCashFlows: number[]): number {
  // Find the first year where cumulative cash flow becomes positive
  for (let i = 1; i < cumulativeCashFlows.length; i++) {
    if (cumulativeCashFlows[i] >= 0) {
      // Interpolate for more accurate payback period
      const previousCF = cumulativeCashFlows[i - 1];
      const currentCF = cumulativeCashFlows[i];
      return i - 1 + Math.abs(previousCF) / (currentCF - previousCF);
    }
  }
  
  return cumulativeCashFlows.length; // If never pays back
}

function calculateTotalLifetimeEnergy(annualProduction: number, degradationRate: number, operationalLifetime: number): number {
  let totalEnergy = 0;
  
  for (let year = 1; year <= operationalLifetime; year++) {
    const degradationFactor = Math.pow(1 - degradationRate / 100, year - 1);
    totalEnergy += annualProduction * degradationFactor;
  }
  
  return totalEnergy;
}