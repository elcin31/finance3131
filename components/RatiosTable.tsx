import { DataTable, DataTableColumn } from "@/components/ui/DataTable";
import { DerivedFinancialYear, ValuationRatios } from "@/lib/types";
import { formatMultiple, formatPercent } from "@/lib/utils/format";

interface RatioRow {
  fiscalYear: number;
  derived: DerivedFinancialYear;
  valuation: ValuationRatios;
}

export function RatiosTable({
  derivedSeries,
  valuationSeries,
}: {
  derivedSeries: DerivedFinancialYear[];
  valuationSeries: ValuationRatios[];
}) {
  const rows: RatioRow[] = derivedSeries.map((d) => ({
    fiscalYear: d.fiscalYear,
    derived: d,
    valuation:
      valuationSeries.find((v) => v.fiscalYear === d.fiscalYear) ??
      valuationSeries[0],
  }));

  const columns: DataTableColumn<RatioRow>[] = [
    { key: "year", header: "FY", render: (r) => r.fiscalYear, align: "left" },
    { key: "pe", header: "P/E", render: (r) => formatMultiple(r.valuation.pe), align: "right" },
    { key: "ps", header: "P/S", render: (r) => formatMultiple(r.valuation.ps), align: "right" },
    { key: "evEbitda", header: "EV/EBITDA", render: (r) => formatMultiple(r.valuation.evToEbitda), align: "right" },
    { key: "evFcf", header: "EV/FCF", render: (r) => formatMultiple(r.valuation.evToFcf), align: "right" },
    { key: "gross", header: "Gross Mgn", render: (r) => formatPercent(r.derived.grossMargin), align: "right" },
    { key: "op", header: "Op Mgn", render: (r) => formatPercent(r.derived.operatingMargin), align: "right" },
    { key: "net", header: "Net Mgn", render: (r) => formatPercent(r.derived.netMargin), align: "right" },
    { key: "roe", header: "ROE", render: (r) => formatPercent(r.derived.roe), align: "right" },
    { key: "roic", header: "ROIC", render: (r) => formatPercent(r.derived.roic), align: "right" },
    { key: "de", header: "D/E", render: (r) => formatMultiple(r.derived.debtToEquity), align: "right" },
    { key: "ndebitda", header: "ND/EBITDA", render: (r) => formatMultiple(r.derived.netDebtToEbitda), align: "right" },
    { key: "fcf", header: "FCF Mgn", render: (r) => formatPercent(r.derived.fcfMargin), align: "right" },
  ];

  return <DataTable columns={columns} rows={rows} keyExtractor={(r) => String(r.fiscalYear)} />;
}
