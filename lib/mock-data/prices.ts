import { HistoricalPriceSeries, PricePoint } from "@/lib/types";

/**
 * Generates a deterministic pseudo-random daily price series using a simple
 * seeded generator, so the app has consistent historical-looking data
 * without needing a real market data API for the MVP stage.
 */
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) % 2147483648;
    return state / 2147483648;
  };
}

function generatePriceSeries(
  ticker: string,
  startPrice: number,
  days: number,
  annualDrift: number,
  annualVol: number,
  seed: number
): PricePoint[] {
  const rand = seededRandom(seed);
  const dailyDrift = annualDrift / 252;
  const dailyVol = annualVol / Math.sqrt(252);

  const prices: PricePoint[] = [];
  let price = startPrice;
  const today = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Box-Muller transform for approximately normal random shocks
    const u1 = Math.max(rand(), 1e-6);
    const u2 = rand();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

    const dailyReturn = dailyDrift + dailyVol * z;
    price = price * (1 + dailyReturn);

    prices.push({
      date: date.toISOString().slice(0, 10),
      price: Math.round(price * 100) / 100,
    });
  }

  return prices;
}

const SEEDS: Record<string, number> = {
  AAPL: 1001,
  MSFT: 2002,
  JPM: 3003,
  NVDA: 4004,
  JNJ: 5005,
  XOM: 6006,
  SPY: 7007,
};

const PROFILE: Record<
  string,
  { start: number; drift: number; vol: number }
> = {
  AAPL: { start: 165, drift: 0.15, vol: 0.28 },
  MSFT: { start: 310, drift: 0.18, vol: 0.24 },
  JPM: { start: 140, drift: 0.14, vol: 0.26 },
  NVDA: { start: 45, drift: 0.55, vol: 0.55 },
  JNJ: { start: 160, drift: 0.03, vol: 0.16 },
  XOM: { start: 105, drift: 0.06, vol: 0.3 },
  SPY: { start: 420, drift: 0.12, vol: 0.16 },
};

const CACHE: Record<string, HistoricalPriceSeries> = {};

export function getHistoricalPrices(ticker: string): HistoricalPriceSeries | null {
  const key = ticker.toUpperCase();
  if (CACHE[key]) return CACHE[key];

  const profile = PROFILE[key];
  const seed = SEEDS[key];
  if (!profile || !seed) return null;

  const series: HistoricalPriceSeries = {
    ticker: key,
    prices: generatePriceSeries(
      key,
      profile.start,
      504, // ~2 years of trading days
      profile.drift,
      profile.vol,
      seed
    ),
  };

  CACHE[key] = series;
  return series;
}

export function getBenchmarkReturns(): number[] {
  const spy = getHistoricalPrices("SPY");
  if (!spy) return [];
  const returns: number[] = [];
  for (let i = 1; i < spy.prices.length; i++) {
    const prev = spy.prices[i - 1].price;
    const curr = spy.prices[i].price;
    returns.push((curr - prev) / prev);
  }
  return returns;
}
