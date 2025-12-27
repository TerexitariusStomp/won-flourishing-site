import { Download, LineChart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import SiteLayout from "@/components/SiteLayout";
import "./bridge.css";
import "./apy.css";

const timelineOptions = [
  { label: "1 month", months: 1 },
  { label: "3 months", months: 3 },
  { label: "6 months", months: 6 },
  { label: "1 year", months: 12 }
];

const compoundingPeriods = 12;
const DEFAULT_DISTRIBUTION_RATE = 0.06;
const DEFAULT_WON_USD_PRICE = 1;
const CHAIN_API = "https://proton.greymass.com/v1/chain";
const ORACLE_REFRESH_MS = 24 * 60 * 60 * 1000;

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2
});

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2
});

function formatCurrency(value: number) {
  if (!Number.isFinite(value)) return "$0.00";
  return currencyFormatter.format(value);
}

function formatNumber(value: number) {
  if (!Number.isFinite(value)) return "0";
  return numberFormatter.format(value);
}

type OracleSnapshot = {
  distributionRate: number;
  wonUsdPrice: number;
  source: string;
};

const normalizeRate = (value: number) => {
  if (!Number.isFinite(value)) return DEFAULT_DISTRIBUTION_RATE;
  if (value > 1) return value / 100;
  return value;
};

const extractDistributionRate = (row: Record<string, unknown> | undefined) => {
  if (!row) return null;
  const keys = Object.keys(row);
  const candidateKey = keys.find((key) => /rate|percent|distribution/i.test(key));
  if (candidateKey) {
    const rawValue = row[candidateKey];
    if (typeof rawValue === "number") return normalizeRate(rawValue);
    if (typeof rawValue === "string") {
      const numeric = Number(rawValue.replace(/[^\d.]/g, ""));
      if (Number.isFinite(numeric)) return normalizeRate(numeric);
    }
  }
  return null;
};

const extractOraclePrice = (row: Record<string, unknown> | undefined) => {
  if (!row) return null;
  const candidateKeys = ["value", "median", "last", "price"];
  for (const key of candidateKeys) {
    const rawValue = row[key];
    if (typeof rawValue === "number") return rawValue;
    if (typeof rawValue === "string") {
      const numeric = Number(rawValue);
      if (Number.isFinite(numeric)) return numeric;
    }
  }
  return null;
};

async function fetchOracleSnapshot(): Promise<OracleSnapshot> {
  const defaultSnapshot = {
    distributionRate: DEFAULT_DISTRIBUTION_RATE,
    wonUsdPrice: DEFAULT_WON_USD_PRICE,
    source: "Fallback baseline"
  };

  try {
    const [distributionResponse, priceResponse] = await Promise.all([
      fetch(`${CHAIN_API}/get_table_rows`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: "w3won",
          table: "distribution",
          scope: "w3won",
          limit: 1
        })
      }),
      fetch(`${CHAIN_API}/get_table_rows`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: "delphioracle",
          table: "datapoints",
          scope: "wonusd",
          limit: 1,
          reverse: true
        })
      })
    ]);

    const distributionPayload = await distributionResponse.json();
    const pricePayload = await priceResponse.json();
    const distributionRow = distributionPayload?.rows?.[0] as Record<string, unknown> | undefined;
    const priceRow = pricePayload?.rows?.[0] as Record<string, unknown> | undefined;

    const distributionRate =
      extractDistributionRate(distributionRow) ?? DEFAULT_DISTRIBUTION_RATE;
    const wonUsdPrice = extractOraclePrice(priceRow) ?? DEFAULT_WON_USD_PRICE;

    return {
      distributionRate,
      wonUsdPrice,
      source: "On-chain oracle snapshot"
    };
  } catch (error) {
    console.error(error);
    return defaultSnapshot;
  }
}

export default function ApyCalculatorPage() {
  const [amountInput, setAmountInput] = useState("1000");
  const [activeTimeline, setActiveTimeline] = useState(timelineOptions[3]);
  const [oracleSnapshot, setOracleSnapshot] = useState<OracleSnapshot>({
    distributionRate: DEFAULT_DISTRIBUTION_RATE,
    wonUsdPrice: DEFAULT_WON_USD_PRICE,
    source: "Baseline reference"
  });
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadOracle = async () => {
      const snapshot = await fetchOracleSnapshot();
      if (!cancelled) {
        setOracleSnapshot(snapshot);
        setLastUpdated(new Date());
      }
    };

    loadOracle();
    const interval = setInterval(loadOracle, ORACLE_REFRESH_MS);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const principal = useMemo(() => {
    const cleaned = amountInput.replace(/,/g, "");
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? Math.max(parsed, 0) : 0;
  }, [amountInput]);

  const projections = useMemo(
    () =>
      timelineOptions.map((option) => {
        const growth = Math.pow(
          1 + oracleSnapshot.distributionRate / compoundingPeriods,
          option.months
        );
        const projectedValue = principal * growth;
        const netYield = projectedValue - principal;
        return { ...option, projectedValue, netYield };
      }),
    [oracleSnapshot.distributionRate, principal]
  );

  const activeProjection = projections.find(
    (projection) => projection.months === activeTimeline.months
  );

  const maxProjected = Math.max(...projections.map((p) => p.projectedValue), 0);

  const handleDownloadCsv = () => {
    const header = [
      "Timeline",
      "Months",
      "Starting Amount (WON)",
      "Projected Value (WON)",
      "Net Yield (WON)",
      "Distribution Rate"
    ];

    const rows = projections.map((projection) => [
      projection.label,
      projection.months.toString(),
      principal.toFixed(2),
      projection.projectedValue.toFixed(2),
      projection.netYield.toFixed(2),
      `${(oracleSnapshot.distributionRate * 100).toFixed(2)}%`
    ]);

    const csvContent = [header, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "won-apy-projection.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadPdf = () => {
    const printableWindow = window.open("", "_blank", "width=920,height=720");
    if (!printableWindow) return;
    const rows = projections
      .map(
        (projection) => `
        <tr>
          <td>${projection.label}</td>
          <td>${formatNumber(projection.projectedValue)} WON</td>
          <td>${formatNumber(projection.netYield)} WON</td>
        </tr>`
      )
      .join("");

    printableWindow.document.write(`
      <html>
        <head>
          <title>WON APY Projection</title>
          <style>
            body { font-family: 'Space Grotesk', Arial, sans-serif; padding: 24px; }
            h1 { margin-bottom: 4px; }
            p { margin-top: 0; color: #355b52; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border-bottom: 1px solid #d3e6df; text-align: left; padding: 10px; }
            th { background: #f1faf7; }
          </style>
        </head>
        <body>
          <h1>WON APY Projection</h1>
          <p>Starting Amount: ${formatNumber(principal)} WON · Distribution Rate: ${(oracleSnapshot.distributionRate * 100).toFixed(2)}%</p>
          <table>
            <thead>
              <tr>
                <th>Timeline</th>
                <th>Projected Value</th>
                <th>Net Yield</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printableWindow.document.close();
    printableWindow.focus();
    setTimeout(() => printableWindow.print(), 250);
  };

  return (
    <SiteLayout>
      <div className="bridge-shell">
        <div className="bridge-page">
          <div className="bridge-header">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <img
                  src="https://gateway.pinata.cloud/ipfs/QmaiJCdbAgC6vPXpMKQNNY5gbUVr7AKALuvdTELUpJSDWi"
                  alt="We Won Logo"
                  className="w-9 h-9 rounded-full object-cover"
                />
                <span className="font-display font-bold text-xl">We Won</span>
              </div>
              <p className="bridge-eyebrow">APY calculator</p>
              <h1 className="bridge-title">WON yield estimates at a glance</h1>
              <p className="bridge-subhead">
                Pull the distribution rate from the on-chain oracle, plug in your holdings, and see
                how holder rewards could compound across short and long timelines.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Oracle source:{" "}
                <a
                  href="https://proton.greymass.com/v1/chain/get_table_rows"
                  className="underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Proton chain API
                </a>
              </p>
            </div>
          </div>

        <div className="bridge-card apy-grid">
          <section className="apy-panel">
            <div className="apy-panel-header">
              <div>
                <p className="bridge-eyebrow">On-chain signal</p>
                <h2 className="apy-title">~{(oracleSnapshot.distributionRate * 100).toFixed(2)}% Distribution</h2>
                <p className="bridge-muted">
                  {lastUpdated ? `Updated ${lastUpdated.toLocaleString()}` : "Fetching oracle snapshot..."} · {oracleSnapshot.source}
                </p>
                <p className="bridge-muted">Oracle price: {formatCurrency(oracleSnapshot.wonUsdPrice)} per WON</p>
              </div>
              <LineChart className="w-10 h-10 text-teal-500" />
            </div>

            <div className="bridge-input-row">
              <div className="bridge-field">
                <label className="bridge-label">Input amount (WON)</label>
                <input
                  className="bridge-input"
                  type="text"
                  value={amountInput}
                  onChange={(event) => setAmountInput(event.target.value)}
                  placeholder="Enter your WON balance"
                />
                <p className="bridge-muted">
                  We use monthly compounding to estimate holder distributions and display USD using the latest oracle price.
                  Estimates are illustrative only.
                </p>
              </div>
              <div className="bridge-field">
                <label className="bridge-label">Projected value</label>
                <div className="apy-stat">
                  <span>{formatNumber(activeProjection?.projectedValue ?? 0)} WON</span>
                  <small>{formatCurrency((activeProjection?.projectedValue ?? 0) * oracleSnapshot.wonUsdPrice)}</small>
                </div>
              </div>
              <div className="bridge-field">
                <label className="bridge-label">Projected net yield</label>
                <div className="apy-stat">
                  <span>{formatNumber(activeProjection?.netYield ?? 0)} WON</span>
                  <small>
                    +{formatCurrency((activeProjection?.netYield ?? 0) * oracleSnapshot.wonUsdPrice)}
                  </small>
                </div>
              </div>
            </div>

            <div className="apy-timeline">
              {timelineOptions.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  className={`bridge-ghost ${
                    activeTimeline.months === option.months ? "apy-active" : ""
                  }`}
                  onClick={() => setActiveTimeline(option)}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="apy-chart">
              {projections.map((projection) => (
                <div key={projection.label} className="apy-bar-row">
                  <div className="apy-bar-label">
                    <span>{projection.label}</span>
                    <strong>{formatNumber(projection.projectedValue)} WON</strong>
                  </div>
                  <div className="apy-bar-track">
                    <div
                      className="apy-bar-fill"
                      style={{
                        width: `${maxProjected ? (projection.projectedValue / maxProjected) * 100 : 0}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="apy-panel apy-actions">
            <h3 className="apy-subtitle">Download projections</h3>
            <p className="bridge-muted">
              Export the return schedule to share with your community or drop into your
              dashboard models.
            </p>
            <button className="bridge-primary" type="button" onClick={handleDownloadCsv}>
              <Download className="w-4 h-4" />
              Download CSV
            </button>
            <button className="bridge-ghost apy-secondary" type="button" onClick={handleDownloadPdf}>
              <Download className="w-4 h-4" />
              Download PDF
            </button>

            <div className="apy-data-card">
              <p className="bridge-eyebrow">Display on dashboard</p>
              <p className="bridge-muted">
                Embed this module on the website or analytics view to illustrate how WON
                compounding could support regeneration. Data feeds refresh daily from on-chain
                distribution and price oracles so estimates stay in sync with XPR activity.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
    </SiteLayout>
  );
}
