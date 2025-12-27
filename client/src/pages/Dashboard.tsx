import { useEffect, useMemo, useState } from "react";
import SiteLayout from "@/components/SiteLayout";
import "./bridge.css";

const MINIMUM_WON = 5000;
const CHAIN_API = "https://proton.greymass.com/v1/chain";

const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0
  }).format(value);

type WalletSnapshot = {
  account: string;
  won: number;
  source: "onchain";
};

type ScopeRow = {
  scope: string;
};

async function fetchWonBalance(account: string) {
  const response = await fetch(`${CHAIN_API}/get_currency_balance`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code: "w3won",
      account,
      symbol: "WON"
    })
  });

  const payload = await response.json();
  if (!Array.isArray(payload) || payload.length === 0) return 0;
  const raw = payload[0] as string;
  const numeric = Number(raw.split(" ")[0]);
  return Number.isFinite(numeric) ? numeric : 0;
}

async function fetchWonHolders() {
  const holders: string[] = [];
  let lowerBound = "";
  let more = true;

  while (more) {
    const response = await fetch(`${CHAIN_API}/get_table_by_scope`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: "w3won",
        table: "accounts",
        lower_bound: lowerBound,
        limit: 200
      })
    });

    const payload = await response.json();
    const rows = (payload?.rows ?? []) as ScopeRow[];
    rows.forEach((row) => holders.push(row.scope));
    if (payload.more) {
      lowerBound = payload.more as string;
    } else {
      more = false;
    }
  }

  const snapshots: WalletSnapshot[] = [];
  const batchSize = 25;
  for (let i = 0; i < holders.length; i += batchSize) {
    const batch = holders.slice(i, i + batchSize);
    const balances = await Promise.all(
      batch.map(async (account) => {
        const balance = await fetchWonBalance(account);
        return balance > 0 ? { account, won: balance, source: "onchain" as const } : null;
      })
    );
    snapshots.push(...balances.filter((item): item is WalletSnapshot => Boolean(item)));
  }

  return snapshots;
}

export default function DashboardPage() {
  const [wallets, setWallets] = useState<WalletSnapshot[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const whitelistedCount = useMemo(
    () => wallets.filter((wallet) => wallet.won >= MINIMUM_WON).length,
    [wallets]
  );

  const sortedWallets = useMemo(
    () => [...wallets].sort((a, b) => b.won - a.won),
    [wallets]
  );

  useEffect(() => {
    let cancelled = false;

    const loadWallets = async () => {
      try {
        setLoading(true);
        setStatus("Fetching on-chain WON holders...");
        const snapshots = await fetchWonHolders();
        if (!cancelled) {
          setWallets(snapshots);
          setLastUpdated(new Date());
          setStatus(`Loaded ${snapshots.length} holders from XPR.`);
        }
      } catch (error) {
        console.error(error);
        if (!cancelled) {
          setStatus("Unable to load the on-chain whitelist right now. Please try again later.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadWallets();
    const interval = setInterval(loadWallets, 60 * 60 * 1000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

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
              <p className="bridge-eyebrow">Whitelist</p>
              <h1 className="bridge-title">WON whitelist status</h1>
              <p className="bridge-subhead">
                Balances are pulled directly from the XPR blockchain for all WON holders. No wallet
                connection is required.
              </p>
            </div>
          </div>

          <div className="bridge-card">
            <div className="bridge-banner">
              Auto-whitelist threshold: <strong>{formatNumber(MINIMUM_WON)} WON</strong>. Data
              refreshes automatically every hour.
            </div>

            <div className="bridge-pill-grid">
              <div>
                <span>Whitelisted wallets</span>
                <strong>{formatNumber(whitelistedCount)}</strong>
              </div>
              <div>
                <span>Minimum on-chain WON</span>
                <strong>{formatNumber(MINIMUM_WON)} WON</strong>
              </div>
              <div>
                <span>Last refreshed</span>
                <strong>{lastUpdated ? lastUpdated.toLocaleString() : "Loading..."}</strong>
              </div>
            </div>

            {status && (
              <div className={`bridge-banner ${status.includes("Unable") ? "error" : "success"}`}>
                {status}
              </div>
            )}

            <div className="bridge-grid" style={{ marginTop: "16px" }}>
              {sortedWallets.map((wallet) => {
                const whitelisted = wallet.won >= MINIMUM_WON;

                return (
                  <div
                    key={`${wallet.account}-${wallet.won}`}
                    className="bg-white border border-border rounded-2xl p-5 shadow-sm"
                  >
                    <p className="text-sm font-semibold text-primary">{wallet.account}</p>
                    <p className="text-base font-semibold mt-2">
                      Balance: {formatNumber(wallet.won)} WON
                    </p>
                    <p className="bridge-muted">Source: On-chain snapshot</p>
                    <div className={`bridge-banner ${whitelisted ? "success" : "error"}`}>
                      {whitelisted
                        ? "Whitelisted for launchpad access."
                        : "Below the auto-whitelist threshold."}
                    </div>
                  </div>
                );
              })}
            </div>

            {!loading && sortedWallets.length === 0 && (
              <div className="bridge-banner error" style={{ marginTop: 16 }}>
                No on-chain holders returned yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
