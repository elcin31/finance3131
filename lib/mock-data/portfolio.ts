import { AssetType, Region, RiskLevel, Sector } from "./company";

export interface Position {
  id: string;
  ticker: string;
  name: string;
  quantity: number;
  currentPrice: number;
  averagePurchasePrice: number;
  sector: Sector | "Cash";
  region: Region;
  assetType: AssetType;
}

export interface PositionWithMetrics extends Position {
  marketValue: number;
  costBasis: number;
  unrealizedGainLoss: number;
  unrealizedGainLossPct: number;
  portfolioWeight: number; // decimal
  contributionToRisk: number; // decimal, approximate
  potentialDownside: number; // decimal, estimated loss in bear scenario
  riskRewardRatio: number | null;
  concentrationRisk: RiskLevel;
  exceedsMaxPosition: boolean;
}

export interface PortfolioRiskSettings {
  maxPositionSize: number; // decimal, e.g. 0.10 for 10%
  maxSectorConcentration: number; // decimal
}

export interface PortfolioRiskMetrics {
  totalValue: number;
  expectedReturn: number | null; // decimal, annualized, if historical data available
  volatility: number | null; // decimal, annualized
  beta: number | null;
  sharpeRatio: number | null;
  maxDrawdown: number | null; // decimal, negative
  sectorConcentration: Record<string, number>; // sector -> weight
  geographicConcentration: Record<string, number>; // region -> weight
  largestPositionWeight: number;
  top3ConcentrationWeight: number;
  top5ConcentrationWeight: number;
  cashAllocation: number;
}

export type AlertSeverity = "info" | "warning" | "critical";

export interface PortfolioAlert {
  id: string;
  severity: AlertSeverity;
  message: string;
  relatedTicker?: string;
}

export interface PricePoint {
  date: string; // ISO date
  price: number;
}

export interface HistoricalPriceSeries {
  ticker: string;
  prices: PricePoint[];
}
