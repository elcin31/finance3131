import { CompanyProfile } from "@/lib/types";

// Sample data for demonstration purposes only. Figures are illustrative
// approximations, not live market data. Replace via the data-service layer
// (see lib/data/financial-data-service.ts) when connecting a real API.
export const MOCK_COMPANIES: CompanyProfile[] = [
  {
    ticker: "AAPL",
    name: "Apple Inc.",
    sector: "Technology",
    region: "North America",
    currency: "USD",
    sharesOutstanding: 15334,
    currentPrice: 227.5,
    description:
      "Designs, manufactures, and markets smartphones, computers, wearables, and services, with a large and growing installed base driving recurring services revenue.",
  },
  {
    ticker: "MSFT",
    name: "Microsoft Corporation",
    sector: "Technology",
    region: "North America",
    currency: "USD",
    sharesOutstanding: 7434,
    currentPrice: 415.2,
    description:
      "Diversified software and cloud infrastructure company with leading positions in productivity software, enterprise cloud (Azure), and operating systems.",
  },
  {
    ticker: "JPM",
    name: "JPMorgan Chase & Co.",
    sector: "Financials",
    region: "North America",
    currency: "USD",
    sharesOutstanding: 2850,
    currentPrice: 205.8,
    description:
      "Largest U.S. bank by assets, operating across consumer banking, investment banking, asset management, and commercial banking segments.",
  },
  {
    ticker: "NVDA",
    name: "NVIDIA Corporation",
    sector: "Technology",
    region: "North America",
    currency: "USD",
    sharesOutstanding: 24600,
    currentPrice: 118.4,
    description:
      "Designer of GPUs and accelerated computing platforms, with a dominant position in data-center AI training and inference hardware.",
  },
  {
    ticker: "JNJ",
    name: "Johnson & Johnson",
    sector: "Healthcare",
    region: "North America",
    currency: "USD",
    sharesOutstanding: 2410,
    currentPrice: 154.3,
    description:
      "Diversified healthcare company spanning pharmaceuticals and medical devices, with a long history of consistent dividend growth.",
  },
  {
    ticker: "XOM",
    name: "Exxon Mobil Corporation",
    sector: "Energy",
    region: "North America",
    currency: "USD",
    sharesOutstanding: 4220,
    currentPrice: 112.6,
    description:
      "Integrated oil and gas major with upstream production, downstream refining, and chemicals operations.",
  },
];

export function getCompanyProfile(ticker: string): CompanyProfile | undefined {
  return MOCK_COMPANIES.find(
    (c) => c.ticker.toUpperCase() === ticker.toUpperCase()
  );
}
