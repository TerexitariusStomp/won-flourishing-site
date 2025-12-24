import { Link, useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import "./bridge.css";

type Project = {
  id: string;
  region: string;
  name: string;
  focus: string;
  target: string;
  staked: string;
  update: string;
};

const projects: Project[] = [
  {
    id: "latam-1",
    region: "latam",
    name: "Barichara Regeneration Fund",
    focus: "Bioregional regeneration hub, agroforestry terraces",
    target: "1,200 households",
    staked: "420k WON",
    update: "Land stewards onboarded, seedling nurseries expanding."
  },
  {
    id: "latam-2",
    region: "latam",
    name: "Tota Sacred Lake",
    focus: "Water quality restoration and permaculture biohubs",
    target: "120 hectares",
    staked: "310k WON",
    update: "Floating gardens underway; youth crews mapped shoreline." 
  },
  {
    id: "east-africa-1",
    region: "east-africa",
    name: "Youth Pawa Mangroves",
    focus: "Community-led mangrove restoration",
    target: "50 hectares",
    staked: "280k WON",
    update: "Seed collection and nursery setup in progress."
  },
  {
    id: "east-africa-2",
    region: "east-africa",
    name: "Kilimanjaro Reforestation",
    focus: "Forest protection and replanting",
    target: "75 hectares",
    staked: "195k WON",
    update: "Satellite MRV baseline complete; planting cohort recruited."
  },
  {
    id: "south-asia-1",
    region: "south-asia",
    name: "AERF Myforest Program",
    focus: "Sacred grove protection",
    target: "300 communities",
    staked: "210k WON",
    update: "Stewardship pledges collected from village circles."
  },
  {
    id: "south-asia-2",
    region: "south-asia",
    name: "Western Ghats Soil Labs",
    focus: "Regenerative soil monitoring",
    target: "20 micro-labs",
    staked: "160k WON",
    update: "Pilot sensors deployed with open data dashboards."
  }
];

const regionLabels: Record<string, string> = {
  latam: "Latin America",
  "east-africa": "East Africa",
  "south-asia": "South Asia"
};

export default function StakeProjectsPage() {
  const [location] = useLocation();
  const search = location.split("?")[1] ?? "";
  const regionKey = new URLSearchParams(search).get("region") ?? "latam";
  const regionName = regionLabels[regionKey] ?? "Selected Region";
  const filtered = projects.filter((project) => project.region === regionKey);

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
            <p className="bridge-eyebrow">Impact projects</p>
            <h1 className="bridge-title">{regionName} funding queue</h1>
            <p className="bridge-subhead">
              Review the impact projects that rise as this region gets more WON stakes. Each stake
              moves the queue toward deployment and reporting.
            </p>
          </div>
          <div className="bridge-nav-links">
            <Link href="/stake" className="bridge-nav-link">
              <ArrowLeft className="w-4 h-4" />
              Back to regions
            </Link>
          </div>
        </div>

        <div className="bridge-card">
          <div className="bridge-pill-grid">
            <div>
              <p className="bridge-muted">Region focus</p>
              <strong>{regionName}</strong>
            </div>
            <div>
              <p className="bridge-muted">Active projects</p>
              <strong>{filtered.length}</strong>
            </div>
            <div>
              <p className="bridge-muted">Next update</p>
              <strong>Weekly</strong>
            </div>
          </div>

          <div className="bridge-grid" style={{ marginTop: 10 }}>
            {filtered.map((project) => (
              <div
                key={project.id}
                className="border border-border rounded-2xl p-5 shadow-sm bg-white"
              >
                <h3 className="font-display text-lg font-semibold">{project.name}</h3>
                <p className="bridge-muted" style={{ marginTop: 6 }}>
                  {project.focus}
                </p>
                <div className="mt-3 grid gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Stake support</span>
                    <strong>{project.staked}</strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Target impact</span>
                    <strong>{project.target}</strong>
                  </div>
                </div>
                <div className="bridge-banner" style={{ marginTop: 12 }}>
                  {project.update}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
