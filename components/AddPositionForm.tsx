"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { NumberField } from "@/components/ui/InputSlider";
import { AssetType, Position, Region, Sector } from "@/lib/types";

const SECTORS: Sector[] = [
  "Technology",
  "Financials",
  "Healthcare",
  "Energy",
  "Consumer Discretionary",
  "Consumer Staples",
  "Industrials",
  "Utilities",
  "Materials",
  "Real Estate",
  "Communication Services",
];

const REGIONS: Region[] = [
  "North America",
  "Europe",
  "Asia Pacific",
  "Emerging Markets",
  "Global",
];

const ASSET_TYPES: AssetType[] = ["Equity", "ETF", "Bond", "Cash", "Commodity"];

export function AddPositionForm({
  onAdd,
}: {
  onAdd: (position: Position) => void;
}) {
  const [ticker, setTicker] = useState("");
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(10);
  const [currentPrice, setCurrentPrice] = useState(100);
  const [avgPrice, setAvgPrice] = useState(90);
  const [sector, setSector] = useState<Sector>("Technology");
  const [region, setRegion] = useState<Region>("North America");
  const [assetType, setAssetType] = useState<AssetType>("Equity");

  function handleSubmit() {
    if (!ticker.trim()) return;
    onAdd({
      id: `pos-${Date.now()}`,
      ticker: ticker.toUpperCase().trim(),
      name: name.trim() || ticker.toUpperCase().trim(),
      quantity,
      currentPrice,
      averagePurchasePrice: avgPrice,
      sector: assetType === "Cash" ? "Cash" : sector,
      region,
      assetType,
    });
    setTicker("");
    setName("");
    setQuantity(10);
    setCurrentPrice(100);
    setAvgPrice(90);
  }

  return (
    <Card>
      <CardHeader title="Add Position" />
      <CardBody className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-ink-600">Ticker</label>
            <input
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              placeholder="e.g. AAPL"
              className="mt-1 w-full rounded-md border border-ink-200 px-2.5 py-1.5 font-mono text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-ink-600">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Optional"
              className="mt-1 w-full rounded-md border border-ink-200 px-2.5 py-1.5 text-sm outline-none focus:border-accent"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <NumberField label="Quantity" value={quantity} onChange={setQuantity} step={1} />
          <NumberField label="Current Price" value={currentPrice} onChange={setCurrentPrice} step={0.5} prefix="$" />
          <NumberField label="Avg. Cost" value={avgPrice} onChange={setAvgPrice} step={0.5} prefix="$" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-medium text-ink-600">Asset Type</label>
            <select
              value={assetType}
              onChange={(e) => setAssetType(e.target.value as AssetType)}
              className="mt-1 w-full rounded-md border border-ink-200 px-2 py-1.5 text-xs outline-none focus:border-accent"
            >
              {ASSET_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-ink-600">Sector</label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value as Sector)}
              disabled={assetType === "Cash"}
              className="mt-1 w-full rounded-md border border-ink-200 px-2 py-1.5 text-xs outline-none focus:border-accent disabled:opacity-40"
            >
              {SECTORS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-ink-600">Region</label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value as Region)}
              className="mt-1 w-full rounded-md border border-ink-200 px-2 py-1.5 text-xs outline-none focus:border-accent"
            >
              {REGIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full rounded-md bg-navy-900 py-2 text-xs font-semibold text-white"
        >
          Add Position
        </button>
      </CardBody>
    </Card>
  );
}
