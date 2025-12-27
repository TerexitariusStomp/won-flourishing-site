import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
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

export default function StakePage() {
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
                Stake WON to elevate regional priorities. Staking is non-custodial, so your WON
                stays yours, and rewards may be distributed to stewards who signal early.
              </p>
            </div>
          </div>

        <div className="bridge-card">
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
                />
                <button type="button" className="bridge-ghost">
                  Max
                </button>
              </div>
              <p className="bridge-muted">
                Connect your wallet to stake WON. You keep custody of your WON and can unstake at any time.
              </p>
            </div>
            <div className="bridge-field">
              <label className="bridge-label">Select region</label>
              <select className="bridge-select">
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
            <a
              className="bridge-primary"
              href="https://github.com/XPRNetwork/proton.contracts?utm_source=perplexity"
              target="_blank"
              rel="noreferrer"
            >
              Connect & stake WON
            </a>
            <div className="bridge-banner" style={{ marginTop: 0 }}>
              Powered by Proton contracts on XPR. Staking does not remove WON from your ownership,
              and rewards may be earned depending on distribution schedules.
            </div>
          </div>

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
                          <button className="ml-auto text-primary text-xs font-semibold">
                            Stake WON
                          </button>
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
