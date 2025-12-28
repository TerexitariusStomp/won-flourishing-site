import { SessionKit, type Session } from "@wharfkit/session";
import { WalletPluginAnchor } from "@wharfkit/wallet-plugin-anchor";
import { WalletPluginCloudWallet } from "@wharfkit/wallet-plugin-cloudwallet";
import { WebRenderer } from "@wharfkit/web-renderer";
import { ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import SiteLayout from "@/components/SiteLayout";
import "./bridge.css";

type Region = {
  id: string;
  name: string;
  focus: string;
  staked: number;
  goal: number;
  projects: string[];
};

const regions: Region[] = [
  {
    id: "latam",
    name: "Latin America (LatAm)",
    focus: "The global leader in nature-based solutions (NbS) and a thriving hub for crypto-utility.",
    staked: 1240000,
    goal: 2000000,
    projects: ["Barichara Regeneration Fund", "Tota Sacred Lake", "Amazon soil hubs"]
  },
  {
    id: "africa",
    name: "Africa",
    focus: 'The frontier for "leapfrog" technologies in energy and climate finance.',
    staked: 860000,
    goal: 1500000,
    projects: ["Youth Pawa Mangroves", "Kilimanjaro reforestation", "Lake Victoria biochar"]
  },
  {
    id: "apac",
    name: "Asia-Pacific (APAC)",
    focus: "The global manufacturing engine for transition hardware and adaptation innovation.",
    staked: 540000,
    goal: 1200000,
    projects: ["AERF Myforest Program", "Western Ghats soil labs", "Himalayan food forests"]
  },
  {
    id: "mena",
    name: "Middle East & North Africa (MENA)",
    focus: 'Pivoting from "Oil States" to "Energy Exporters" via massive capital deployment.',
    staked: 430000,
    goal: 1100000,
    projects: ["Sahara solar hubs", "Red Sea mangrove belts"]
  },
  {
    id: "europe",
    name: "Europe",
    focus: 'The regulatory superpower and "Headquarters" for ReFi protocols.',
    staked: 370000,
    goal: 900000,
    projects: ["Regen Network pilots", "Forest commons", "Local energy co-ops"]
  },
  {
    id: "na",
    name: "North America",
    focus: "Tech-driven optimization and investment capital.",
    staked: 290000,
    goal: 850000,
    projects: ["Appalachian soil regen", "Climate tech labs"]
  }
];

const stats = [
  { label: "Total WON staked", value: "2.64M" },
  { label: "Regions in queue", value: "6" },
  { label: "Next allocation cycle", value: "1 project / month" }
];

const formatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0
});

const PROTON_CHAIN_ID =
  "384da888112027f0321850a169f737c33e53b388aad48b5adace4bab97f437e0";
const PROTON_CHAIN_URL = (import.meta.env.VITE_XPR_RPC_URL ?? "https://proton.greymass.com").trim();
const STAKING_VAULT_ACCOUNT = (import.meta.env.VITE_WON_STAKING_ACCOUNT ?? "").trim();
const WON_TOKEN_CONTRACT = (import.meta.env.VITE_WON_TOKEN_CONTRACT ?? "w3won").trim();
const WON_TOKEN_SYMBOL = (import.meta.env.VITE_WON_TOKEN_SYMBOL ?? "WON").trim();
const WON_TOKEN_DECIMALS = Number(import.meta.env.VITE_WON_TOKEN_DECIMALS ?? 4);
const WEBIO_SESSION_KEY = "webio-session";

export default function StakePage() {
  const [location] = useLocation();
  const search = location.split("?")[1] ?? "";
  const regionParam = new URLSearchParams(search).get("region") ?? "";
  const resolvedRegion = regions.some((region) => region.id === regionParam)
    ? regionParam
    : regions[0].id;
  const [selectedRegion, setSelectedRegion] = useState(resolvedRegion);
  const [stakeAmount, setStakeAmount] = useState("");
  const [stakeError, setStakeError] = useState<string | null>(null);
  const [stakeStatus, setStakeStatus] = useState<"idle" | "signing" | "success">("idle");
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const sessionKit = useMemo(
    () =>
      new SessionKit({
        appName: "We Won",
        chains: [
          {
            id: PROTON_CHAIN_ID,
            url: PROTON_CHAIN_URL
          }
        ],
        ui: new WebRenderer(),
        walletPlugins: [new WalletPluginAnchor(), new WalletPluginCloudWallet()]
      }),
    []
  );

  useEffect(() => {
    setSelectedRegion(resolvedRegion);
  }, [resolvedRegion]);

  useEffect(() => {
    const restoreSession = async () => {
      const stored = localStorage.getItem(WEBIO_SESSION_KEY);
      if (!stored) {
        return;
      }
      try {
        const restored = await sessionKit.restore(JSON.parse(stored));
        if (restored) {
          setSession(restored);
        }
      } catch (error) {
        console.warn("Unable to restore Webio session", error);
        localStorage.removeItem(WEBIO_SESSION_KEY);
      }
    };

    restoreSession();
  }, [sessionKit]);

  const formatQuantity = (amount: string) => {
    const parsed = Number(amount);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      return null;
    }
    const decimals = Number.isFinite(WON_TOKEN_DECIMALS) ? Math.max(0, WON_TOKEN_DECIMALS) : 4;
    return `${parsed.toFixed(decimals)} ${WON_TOKEN_SYMBOL}`;
  };

  const connectWallet = async () => {
    if (isConnecting) {
      return;
    }
    setIsConnecting(true);
    setStakeError(null);
    try {
      const loginResult = await sessionKit.login();
      setSession(loginResult.session);
      localStorage.setItem(WEBIO_SESSION_KEY, JSON.stringify(loginResult.session.serialize()));
    } catch (error) {
      console.error(error);
      setStakeError("Unable to connect to your XPR wallet. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    if (!session) {
      return;
    }
    try {
      await sessionKit.remove(session);
    } catch (error) {
      console.warn("Unable to remove Webio session", error);
    }
    setSession(null);
    localStorage.removeItem(WEBIO_SESSION_KEY);
  };

  const handleStake = async () => {
    if (!session) {
      await connectWallet();
      return;
    }
    const quantity = formatQuantity(stakeAmount);
    if (!quantity) {
      setStakeError("Enter a valid stake amount.");
      return;
    }
    if (!STAKING_VAULT_ACCOUNT) {
      setStakeError("Staking vault account is not configured.");
      return;
    }
    if (!WON_TOKEN_CONTRACT || !WON_TOKEN_SYMBOL) {
      setStakeError("WON token configuration is missing.");
      return;
    }

    setStakeError(null);
    setStakeStatus("signing");
    setTransactionId(null);

    try {
      const response = await session.transact({
        actions: [
          {
            account: WON_TOKEN_CONTRACT,
            name: "transfer",
            authorization: [session.permissionLevel],
            data: {
              from: session.actor.toString(),
              to: STAKING_VAULT_ACCOUNT,
              quantity,
              memo: `Stake ${selectedRegion.toUpperCase()}`
            }
          }
        ]
      });

      const txId =
        response?.response?.transaction_id ?? response?.transaction_id ?? null;
      setTransactionId(txId);
      setStakeStatus("success");
      setStakeAmount("");
    } catch (error) {
      console.error(error);
      setStakeStatus("idle");
      setStakeError("Unable to submit the stake transaction. Please try again.");
    }
  };

  const connectionLabel = session ? session.permissionLevel.toString() : null;

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
              <p className="bridge-eyebrow">Stake to Prioritize</p>
              <h1 className="bridge-title">Route WON toward the regions you want funded first.</h1>
              <p className="bridge-subhead">
                Stake WON on Proton (XPR) to elevate regional priorities. Staking is non-custodial,
                so your WON stays yours, and rewards may be distributed to stewards who signal early.
              </p>
            </div>
          </div>

          <div className="bridge-card" id="stake-form">
            <div className="bridge-pill-grid">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="bridge-muted">{stat.label}</p>
                  <strong>{stat.value}</strong>
                </div>
              ))}
            </div>

            <div className="bridge-input-row" style={{ marginTop: 8 }}>
              <div className="bridge-field">
                <label className="bridge-label">Stake amount (WON)</label>
                <div className="bridge-input-shell">
                  <input
                    type="number"
                    className="bridge-input"
                    placeholder="e.g., 12,500"
                    min="0"
                    value={stakeAmount}
                    onChange={(event) => setStakeAmount(event.target.value)}
                  />
                  <button type="button" className="bridge-ghost">
                    Max
                  </button>
                </div>
                <p className="bridge-muted">
                  Connect your XPR wallet via Webio to stake WON. You keep custody of your WON and
                  can unstake at any time.
                </p>
              </div>
              <div className="bridge-field">
                <label className="bridge-label">Select region</label>
                <select
                  className="bridge-select"
                  value={selectedRegion}
                  onChange={(event) => setSelectedRegion(event.target.value)}
                >
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
                <p className="bridge-muted">Priority updates every 24 hours as stakes move.</p>
              </div>
            </div>

            <div className="bridge-input-row" style={{ marginTop: 10 }}>
              <button
                className="bridge-primary"
                type="button"
                onClick={handleStake}
                disabled={stakeStatus === "signing" || isConnecting}
              >
                {session ? "Stake WON" : isConnecting ? "Connecting..." : "Connect XPR wallet"}
              </button>
              <div className="bridge-banner" style={{ marginTop: 0 }}>
                {connectionLabel
                  ? `Connected: ${connectionLabel} · Proton (XPR)`
                  : "Connect your XPR wallet to stake WON on Proton."}
                {session && (
                  <button type="button" className="bridge-ghost" onClick={disconnectWallet}>
                    Disconnect
                  </button>
                )}
              </div>
            </div>

            {stakeError && (
              <div className="bridge-banner error" style={{ marginTop: 12 }}>
                {stakeError}
              </div>
            )}
            {stakeStatus === "signing" && (
              <div className="bridge-banner" style={{ marginTop: 12 }}>
                Wallet signature requested. Confirm the stake transaction in your Proton wallet.
              </div>
            )}
            {stakeStatus === "success" && (
              <div className="bridge-banner success" style={{ marginTop: 12 }}>
                Stake confirmed on-chain.
                {transactionId && (
                  <span className="block text-xs mt-1">Transaction: {transactionId}</span>
                )}
              </div>
            )}
            {STAKING_VAULT_ACCOUNT && (
              <p className="bridge-muted" style={{ marginTop: 8 }}>
                Staking vault: {STAKING_VAULT_ACCOUNT}
              </p>
            )}

            <div className="bridge-grid" style={{ marginTop: 20 }}>
              {regions.map((region) => {
                const progress = Math.min((region.staked / region.goal) * 100, 100);
                return (
                  <div
                    key={region.id}
                    className="border border-border rounded-2xl p-5 shadow-sm bg-white"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-lg font-semibold">{region.name}</h3>
                        <p className="bridge-muted" style={{ marginTop: 4 }}>
                          {region.focus}
                        </p>
                      </div>
                      <Link
                        href={`/stake/projects?region=${region.id}`}
                        className="bridge-nav-link"
                      >
                        View projects <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm font-semibold">
                        <span>{formatter.format(region.staked)} WON staked</span>
                        <span className="text-muted-foreground">
                          Goal {formatter.format(region.goal)}
                        </span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-muted">
                        <div
                          className="h-2 rounded-full bg-emerald-400"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 text-sm">
                      <p className="text-muted-foreground mb-2">Top impact projects</p>
                      <ul className="space-y-1">
                        {region.projects.map((project) => (
                          <li key={project} className="flex items-center gap-2">
                            <span className="text-emerald-600">•</span>
                            <span>{project}</span>
                            <a
                              className="ml-auto text-primary text-xs font-semibold"
                              href="#stake-form"
                            >
                              Stake WON
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </SiteLayout>
  );
}
