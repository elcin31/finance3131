export type ScenarioName = "Bear Case" | "Base Case" | "Bull Case";

export interface ScenarioAssumptions {
  name: ScenarioName;
  revenueGrowthDelta: number; // decimal adjustment to base growth rate, e.g. -0.05
  fcfMarginDelta: number; // decimal adjustment to base FCF margin
  waccDelta: number; // decimal adjustment to base WACC
  description: string;
}

export interface ScenarioResult {
  name: ScenarioName;
  fairValuePerShare: number;
  portfolioValue: number;
  portfolioReturn: number; // decimal vs current portfolio value
  potentialDrawdown: number; // decimal, negative
}

export interface ManualShock {
  id: string;
  targetTicker: string | "MARKET"; // "MARKET" applies to all equity positions
  shockPct: number; // decimal, e.g. -0.30 for -30%
  label: string;
}

export interface ShockImpactResult {
  shocks: ManualShock[];
  originalPortfolioValue: number;
  shockedPortfolioValue: number;
  impactAmount: number;
  impactPct: number;
  positionImpacts: {
    ticker: string;
    originalValue: number;
    shockedValue: number;
    impactAmount: number;
  }[];
}
