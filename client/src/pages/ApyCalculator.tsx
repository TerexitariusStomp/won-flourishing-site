import { Link } from "wouter";
import { Download, LineChart } from "lucide-react";
import { useMemo, useState } from "react";
import "./bridge.css";
import "./apy.css";

const timelineOptions = [
  { label: "1 month", months: 1 },
  { label: "3 months", months: 3 },
  { label: "6 months", months: 6 },
  { label: "1 year", months: 12 }
];

const compoundingPeriods = 12;
const apyRate = 0.6;

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

export default function ApyCalculatorPage() {
  const [amountInput, setAmountInput] = useState("1000");
  const [activeTimeline, setActiveTimeline] = useState(timelineOptions[3]);
  const [lastUpdated] = useState(() => new Date());

  const principal = useMemo(() => {
    const cleaned = amountInput.replace(/,/g, "");
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? Math.max(parsed, 0) : 0;
  }, [amountInput]);

  const projections = useMemo(
    () =>
      timelineOptions.map((option) => {
        const growth = Math.pow(1 + apyRate / compoundingPeriods, option.months);
        const projectedValue = principal * growth;
        const netYield = projectedValue - principal;
        return { ...option, projectedValue, netYield };
      }),
    [principal]
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
      "APY"
    ];

    const rows = projections.map((projection) => [
      projection.label,
      projection.months.toString(),
      principal.toFixed(2),
      projection.projectedValue.toFixed(2),
      projection.netYield.toFixed(2),
      `${apyRate * 100}%`
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
          <p>Starting Amount: ${formatNumber(principal)} WON · APY: ${apyRate * 100}%</p>
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
            <h1 className="bridge-title">WON returns at a glance</h1>
            <p className="bridge-subhead">
              Pull your on-chain yield signal, plug in your holdings, and see how the
              WON regenerative flywheel compounds across short and long timelines.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Source data:{" "}
              <a
                href="https://proton.alcor.exchange/analytics/tokens/won-w3won"
                className="underline"
                target="_blank"
                rel="noreferrer"
              >
                Alcor WON analytics
              </a>
            </p>
          </div>
          <div className="bridge-nav-links">
            <Link href="/" className="bridge-nav-link">
              Back home
            </Link>
          </div>
        </div>

        <div className="bridge-card apy-grid">
          <section className="apy-panel">
            <div className="apy-panel-header">
              <div>
                <p className="bridge-eyebrow">On-chain signal</p>
                <h2 className="apy-title">~{apyRate * 100}% APY</h2>
                <p className="bridge-muted">
                  Updated {lastUpdated.toLocaleString()} · WON staking pool snapshot
                </p>
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
                <p className="bridge-muted">We use monthly compounding to estimate yield.</p>
              </div>
              <div className="bridge-field">
                <label className="bridge-label">Projected value</label>
                <div className="apy-stat">
                  <span>{formatNumber(activeProjection?.projectedValue ?? 0)} WON</span>
                  <small>{formatCurrency(activeProjection?.projectedValue ?? 0)}</small>
                </div>
              </div>
              <div className="bridge-field">
                <label className="bridge-label">Projected net yield</label>
                <div className="apy-stat">
                  <span>{formatNumber(activeProjection?.netYield ?? 0)} WON</span>
                  <small>+{formatCurrency(activeProjection?.netYield ?? 0)}</small>
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
                compounding funds regeneration. Data feeds are ready to swap for live oracle
                inputs as they go on-chain so APY stays in sync with XPR activity.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
