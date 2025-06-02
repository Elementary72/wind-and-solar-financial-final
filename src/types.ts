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

export interface Location {
  latitude: number;
  longitude: number;
  name?: string;
}

export interface WeatherData {
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    wind_speed_10m: number[];
    wind_speed_80m: number[];
    wind_speed_120m: number[];
    wind_speed_180m: number[];
    direct_normal_irradiance: number[];
    diffuse_radiation: number[];
    shortwave_radiation: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    windspeed_10m_max: number[];
  };
}

export interface MLPrediction {
  predictedOutput: number;
  confidence: number;
}

export interface DataSource {
  type: 'manual' | 'csv' | 'api';
  data: any;
}