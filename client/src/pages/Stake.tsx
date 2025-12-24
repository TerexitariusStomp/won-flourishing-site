import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
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
    name: "Latin America",
    focus: "Agroforestry co-ops + water resilience",
    staked: 1240000,
    goal: 2000000,
    projects: ["Barichara Regeneration Fund", "Tota Sacred Lake", "Amazon soil hubs"]
  },
  {
    id: "east-africa",
    name: "East Africa",
    focus: "Mangrove restoration + solar micro-grids",
    staked: 860000,
    goal: 1500000,
    projects: ["Youth Pawa Mangroves", "Kilimanjaro reforestation", "Lake Victoria biochar"]
  },
  {
    id: "south-asia",
    name: "South Asia",
    focus: "Sacred grove protection + regenerative farms",
    staked: 540000,
    goal: 1200000,
    projects: ["AERF Myforest Program", "Western Ghats soil labs", "Himalayan food forests"]
  }
];

const stats = [
  { label: "Total WON staked", value: "2.64M" },
  { label: "Regions in queue", value: "6" },
  { label: "Next allocation cycle", value: "12 days" }
];

const formatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0
});

export default function StakePage() {
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
            <p className="bridge-eyebrow">Stake to Prioritize</p>
            <h1 className="bridge-title">Route WON toward the regions you want funded first.</h1>
            <p className="bridge-subhead">
              Stake WON to elevate regional priorities. Each cycle, the highest-staked regions unlock
              faster funding for local impact projects and new eco-village launches.
            </p>
          </div>
          <div className="bridge-nav-links">
            <Link href="/" className="bridge-nav-link">
              Back home
            </Link>
            <Link href="/stake/projects" className="bridge-nav-link">
              Impact projects
            </Link>
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
                Staked WON signals which regions receive next-wave project funding.
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
            <button type="button" className="bridge-primary">
              Signal priority stake
            </button>
            <div className="bridge-banner" style={{ marginTop: 0 }}>
              Wallet connection and on-chain staking will open with the next deployment.
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
  );
}
