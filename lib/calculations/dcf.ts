export interface DCFInputs {
  currentRevenue: number; // millions
  currentFCF: number; // millions
  revenueGrowthRate: number; // decimal, e.g. 0.10 for 10%
  fcfMargin: number; // decimal
  forecastYears: number; // e.g. 5, 10
  wacc: number; // decimal
  terminalGrowthRate: number; // decimal
  netDebt: number; // millions, can be negative (net cash)
  sharesOutstanding: number; // millions
  currentSharePrice: number;
}

export interface DCFForecastYear {
  year: number;
  revenue: number;
  fcf: number;
  discountFactor: number;
  presentValueFCF: number;
}

export interface DCFResult {
  forecast: DCFForecastYear[];
  sumPVForecastFCF: number;
  terminalValue: number;
  presentValueTerminalValue: number;
  enterpriseValue: number;
  equityValue: number;
  fairValuePerShare: number;
  currentSharePrice: number;
  marginOfSafety: number; // decimal, (fairValue - price) / fairValue
  upsideDownside: number; // decimal, (fairValue - price) / price
}

export interface SensitivityCell {
  wacc: number;
  terminalGrowth: number;
  fairValuePerShare: number;
}

export type SensitivityGrid = SensitivityCell[][];
