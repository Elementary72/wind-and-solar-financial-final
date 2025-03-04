// Input data types
export interface InputData {
  // System Parameters
  systemSize: number;
  dailyProductionHours: number;
  gridEmissionFactor: number;
  operationalLifetime: number;
  costPerKW: number;
  installationCost: number;
  degradationRate: number;
  operationalCosts: number;
  
  // Financial Parameters
  electricityPrice: number;
  electricityPriceIncrease: number;
  financingYears: number;
  interestRate: number;
  inflationRate: number;
  discountRate: number;
}

// Results types
export interface FinancialResults {
  npv: number;
  irr: number;
  paybackPeriod: number;
  roi: number;
  lcoe: number;
  yearlyCashFlows: number[];
  cumulativeCashFlows: number[];
  initialInvestment: number;
}

export interface CarbonResults {
  dailyReduction: number;
  yearlyReduction: number;
  lifetimeReduction: number;
  carbonValue: number;
  yearlyValues: number[];
  comparisonWithCoal: number;
}

export interface EnergyResults {
  dailyOutput: number;
  monthlyOutput: number[];
  yearlyOutput: number[];
  totalLifetimeOutput: number;
}

export interface ElectricityPriceResults {
  years: number[];
  prices: number[];
}